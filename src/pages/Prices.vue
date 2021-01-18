<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="row justify-between q-pb-none">
        <q-btn to="/" color="primary" push icon="keyboard_backspace"/>
        <q-btn :disable="tableLoading" @click="refreshTokenPrices" color="primary" push icon="refresh" />
      </q-card-section>
      <q-card-section>
        <q-table
          :grid="$q.screen.xs"
          :title="$t('prices_table_title')"
          :data="coinRates"
          :columns="coinColumns"
          row-key="name"
          :loading="tableLoading"
          :pagination="{sortBy: 'usdBalance', descending: true, rowsPerPage: 10}"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Web3 from 'web3'
import { mapGetters } from 'vuex'
import { colors } from 'quasar'
import genericBep20Contract from '../utils/constants/genericBep20TokenContract'
import tokens from '../utils/tokens'
const { bnb, cake } = tokens

const BNObject = Web3.utils.BN;
const BN = (x) => new BNObject(x)

export default {
  name: 'prices',
  components: {},
  data: function () {
    return {
      connected: false,
      isBSC: true,
      priceDialog: false,
      errorMessage: "",
      tableLoading: false,
      coinRates: []
    }
  },
  computed: {
    ...mapGetters('store', {
      'web3': 'getWeb3',
      'poolContract': 'getPoolContract',
      'cakeContract': 'getCakeContract',
      'swapContract': 'getSwapContract',
    }),
    coinColumns(){
      return [
        {
          name: 'name',
          required: true,
          label: this.$t('name'),
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: false
        },
        {
          name: 'price',
          required: true,
          label: this.$t('price_busd'),
          align: 'left',
          field: row => row.usdPrice,
          format: val => `$ ${this.$options.filters.round(val)}`,
          sortable: false
        },
        {
          name: 'balance',
          required: true,
          label: this.$t('wallet_balance'),
          align: 'left',
          field: row => row.balance,
          format: val => `${this.$options.filters.round(val)}`,
          sortable: false
        },
        {
          name: 'usdBalance',
          required: true,
          label: this.$t('wallet_balance_busd'),
          align: 'left',
          field: row => row.balance * row.usdPrice,
          format: val => `$ ${this.$options.filters.round(val)}`,
          sortable: false
        }
      ]
    },
    userAddress(){
      return this.web3.coinbase
    },
  },
  async mounted () {
    const connected = this.$q.localStorage.getItem('account-connected')
    if (connected === 'true') {
      await this.connectWallet()
      await this.refreshTokenPrices()
    }
  },
  methods: {
    fromWei(number) {
      return number?web3.utils.fromWei(toPlainString(number)):0
    },
    toWei(number) {
      const strNumber = number.toString().substring(0, 20)
      return number?web3.utils.toWei(strNumber):0
    },
    async connectWallet() {
      try {
        await this.$store.dispatch('store/registerWeb3')
        await this.$store.dispatch('store/getContractInstance')
        this.connected = this.web3.isInjected
        this.isBSC = this.web3.networkId == 56
      }
      catch (error) {
        this.errorMessage = error
        setTimeout(this.connectWallet, 2000)
      }
    },
    async getRate(tokenFrom, tokenTo) {
      const amount = 10**tokenFrom.decimals
      const rate = await this.swapContract().methods.getAmountsIn( amount.toString() , [tokenTo.address, tokenFrom.address]).call({ from: this.userAddress })
      return rate[0]
    },
    async getBalanceOf(token, userAddress) {
      const contract = new web3.eth.Contract(genericBep20Contract.ABI, token.address, {})
      const balance = await contract.methods.balanceOf(this.userAddress).call({ from: this.userAddress })
      return balance / 10**token.decimals
    },
    async refreshTokenPrices() {
      this.tableLoading = true
      const bnbBusdRate = await this.getRate(tokens.bnb, tokens.busd)
      
      this.coinRates = []
      Object.keys(tokens).forEach(async (tokenCode) => {
        try {
          const token = tokens[tokenCode]
          let tokenBalance = await this.getBalanceOf(token, this.userAddress)
          if (tokenCode == tokens.bnb.name.toLowerCase()) {
            tokenBalance += this.fromWei(this.web3.balance)
          }

          if (!tokenBalance) return

          let rateInBnb = this.toWei("1")
          if (tokenCode != tokens.bnb.name.toLowerCase()) {
            rateInBnb = await this.getRate(token, tokens.bnb)
          }
          const rateInUsd = this.fromWei(bnbBusdRate) * this.fromWei(rateInBnb)
          const rate = {...token, bnbPrice: this.fromWei(rateInBnb), usdPrice: rateInUsd.toString(), balance: tokenBalance}
          this.coinRates.push(rate)
        }
        catch (e){
          console.error(e)
        }
      })
      this.tableLoading = false
    }
  }
}

function toPlainString(num) { // BN.js Throws from 1e+21 and above so using this make shift function
  return (''+num).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/,
    function(a,b,c,d,e) {
    return e < 0
      ? b + '0.' + Array(1-e-c.length).join(0) + c + d
      : b + c + d + Array(e-d.length+1).join(0);
    }
  );
}
</script>

<style scoped>
</style>