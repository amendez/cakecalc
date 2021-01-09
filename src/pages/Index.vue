<template>
  <q-page class="flex flex-center">
    <div class="row q-gutter-sm" :class="{'alone':!connected}" >
      <div class="col-12 col-md" :class="{'col-md':connected, 'col-md':!connected}" >
        <q-card>
          <q-card-section class="text-white" :class="{'bg-secondary':!connected, 'bg-green':connected}">
            <div class="text-h6">{{ !connected ? $t("connect_your_wallet"): $("wallet_connected") }}</div>
            <div class="text-subtitle2" v-if="!connected">
              {{ $t('please_connect') }}
            </div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn :disabled="connected" @click="connectWallet" flat icon="calculate">Connect wallet</q-btn>
            <q-btn :disabled="!connected" @click="doCalcs" flat icon="refresh">Refresh data!</q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="connected && !isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">Error</div>
            <div class="text-subtitle2">Please use BSC (Binance Smart Chain) network)</div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="connected && isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Wallet info</div>
            <q-markup-table>
              <tbody>
                <tr>
                  <td class="text-left">Address</td>
                  <td class="text-right">{{ userAddress.substring(0,8) }}.....{{ userAddress.substring(34) }}</td>
                </tr>
                <tr>
                  <td class="text-left">BNB Balance</td>
                  <td class="text-right">{{ fromWei(web3.balance) }}</td>
                </tr>
                <tr>
                  <td class="text-left">CAKE Balance</td>
                  <td class="text-right">{{ fromWei(amountInPool) }}</td>
                </tr>
                <tr>
                  <td class="text-left">CAKEs to harvest</td>
                  <td class="text-right">{{ fromWei(pendingHarvest) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="connected && isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">Pool info</div>
            <q-markup-table>
              <tbody>
                <tr>
                  <td class="text-left">APY</td>
                  <td class="text-right">{{ apy }}%</td>
                </tr>
                <tr>
                  <td class="text-left">BNB/CAKE rate</td>
                  <td class="text-right">{{ fromWei(BNB_CAKERate) }}</td>
                </tr>
                <tr>
                  <td class="text-left">Est. gas cost (BNB)</td>
                  <td class="text-right">{{ fromWei(estimatedGasInBNB) }} BNB</td>
                </tr>
                <tr>
                  <td class="text-left">Est. gas cost (CAKE)</td>
                  <td class="text-right">{{ fromWei(estimatedGasInCAKE) }} CAKE</td>
                </tr>
                <tr>
                  <td class="text-left">CAKEs to harvest</td>
                  <td class="text-right">{{ fromWei(pendingHarvest) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <div class="row" v-if="connected && isBSC && calculatedData.length">
      <div class="col-12">
        <br>
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Summary!</div>
            <q-banner rounded class="bg-white text-black">
              <template v-slot:avatar>
                <img src="~assets/cake.svg" width="64px" alt="pancakes">
              </template>
              <span class="text-weight-bold">
                You should compound your cakes every <span class="text-green">{{ maxHours.periodLengthInHours }} hours</span> or when you have <span class="text-green"> {{ fromWei(maxHours.cakesByPeriod) }} CAKES</span>.
              </span>
            </q-banner>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="connected && isBSC && calculatedData.length">
      <div class="col-12">
        <br>
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Detailed results!</div>
            <q-markup-table class="results">
              <tbody>
                <tr class="header">
                  <td>hours</td>
                  <td>cakesByPeriod</td>
                  <td>periodInterestRate</td>
                  <td>periodCount</td>
                  <td>investedAmount</td>
                  <td>networkFeeInCakes</td>
                  <td>composedInterestRate</td>
                  <td>totalFeeCostInPeriod</td>
                  <td>earned</td>
                </tr>
                <tr v-for="data in calculatedData" :key="data.periodLengthInHours" :class="{ max: (data.periodLengthInHours == maxHours.periodLengthInHours) }">
                  <td class="text-left">{{ data.periodLengthInHours }}</td>
                  <td class="text-left">{{ fromWei(data.cakesByPeriod) }}</td>
                  <td class="text-left">{{ data.periodInterestRate }}</td>
                  <td class="text-left">{{ data.periodCount }}</td>
                  <td class="text-left">{{ fromWei(data.investedAmount) }}</td>
                  <td class="text-left">{{ fromWei(data.networkFeeInCakes) }}</td>
                  <td class="text-left">{{ data.composedInterestRate }}</td>
                  <td class="text-left">{{ fromWei(data.totalFeeCostInPeriod) }}</td>
                  <td class="text-left">{{ fromWei(data.earned) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Web3 from 'web3'
import { mapGetters } from 'vuex'

const BNObject = Web3.utils.BN;
const POOL_INDEX = 0
const GAS_COST = 20
const BN = (x) => new BNObject(x)

export default {
  name: 'cakeculator',
  data: function () {
    return {
      connected: false,
      isBSC: true,
      amountInPool: 0,
      poolAllocPoint: 0,
      estimatedGasInBNB: 0,
      BNB_CAKERate: 0,
      pendingHarvest: 0,
      apy: 0,
      calculatedData: [],
    }
  },
  computed: {
    ...mapGetters('store', {
      'web3': 'getWeb3',
      'poolContract': 'getPoolContract',
      'cakeContract': 'getCakeContract',
      'swapContract': 'getSwapContract',
    }),
    userAddress(){
      return this.web3.coinbase
    },
    estimatedGasInCAKE() {
      return this.toWei(this.fromWei(this.estimatedGasInBNB) * this.fromWei(this.BNB_CAKERate))
    },
    maxHours() {
      let max = {earned: 0}
      this.calculatedData.forEach(data => max = (data.earned > max.earned)?data:max)
      return max
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
      this.$q.loading.show({
        message: 'Please wait while we <b>count</b> your CAKEs...'
      })
      await this.$store.dispatch('store/registerWeb3')
      await this.$store.dispatch('store/getContractInstance')
      this.connected = this.web3.isInjected
      this.isBSC = this.web3.networkId == 56
      await this.doCalcs()
      this.$q.loading.hide()
    },
    async getPoolInfo() {
      const objectResult = await this.poolContract().methods.poolInfo(POOL_INDEX).call({ from: this.userAddress })
      this.poolAllocPoint = objectResult.allocPoint
    },
    async getUserInfo() {
      const objectResult = await this.poolContract().methods.userInfo(POOL_INDEX, this.userAddress).call({ from: this.userAddress })
      this.amountInPool = objectResult.amount
    },
    async getPendingCake() {
      const result = await this.poolContract().methods.pendingCake(POOL_INDEX, this.userAddress).call({ from: this.userAddress })
      this.pendingHarvest = result
    },
    async estimateGas() {
      const gas = await this.poolContract().methods.enterStaking(1).estimateGas({from: this.userAddress})
      this.estimatedGasInBNB = this.toWei(gas * GAS_COST * 0.000000001)
    },
    async getConversionRate() {
      const rate = await this.swapContract().methods.getAmountsIn(this.toWei(1), ["0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82","0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"]).call({ from: this.userAddress })
      this.BNB_CAKERate = rate[0]
    },
    async doCalcs() {
      const hours = [
        1,2,3,4,5,6,12,18,24,30,36,42,48,56,72,84,96,
        (12*9),12*10,24*6,24*7,24*8,24*9,24*10,24*15,24*20,24*25,24*30]

      for (const hour of hours) {
        await this.doCalc(hour)
      }
    },
    async doCalc(hours = 1) {
      if (!this.apy) {
        await this.getAPY()
      }
      if (!this.amountInPool) {
        await this.getUserInfo()
      }
      if (!this.estimatedGasInCAKE) {
        await this.estimateGas()
        await this.getConversionRate()
      }
      if (!this.pendingHarvest) {
        this.getPendingCake()
      }

      const periodInterestRate = ((this.apy / 365 / 24) * hours) / 100 + 1
      const periodCount = 720 / hours
      const investedAmount = this.amountInPool
      const networkFee = this.estimatedGasInCAKE
      
      const composedInterestRate = periodInterestRate ** periodCount
      const totalFeeCost = networkFee * periodCount
      
      const result = (investedAmount * composedInterestRate - totalFeeCost - investedAmount)
      
      const cakesByPeriod = investedAmount * (periodInterestRate - 1)
      
      console.debug('==================================================================')
      console.debug('periodLengthInHours: ' + hours)
      console.debug('periodInterestRate: ' + periodInterestRate)
      console.debug('periodCount: ' + periodCount)
      console.debug('investedAmount: ' + this.fromWei(investedAmount) + ' CAKES')
      console.debug('networkFee: ' + this.fromWei(networkFee) + ' CAKES')
      console.debug("composedInterestRate: " + composedInterestRate)
      console.debug("totalFeeCost: " + this.fromWei(totalFeeCost) + ' CAKES')
      console.debug("EARNED CAKES AFTER 1 MONTH: " + this.fromWei(result) + ' CAKES')
      
      this.calculatedData.push({
        periodLengthInHours: hours,
        cakesByPeriod: cakesByPeriod,
        periodInterestRate: periodInterestRate,
        periodCount: periodCount,
        investedAmount: investedAmount,
        networkFeeInCakes: networkFee,
        composedInterestRate: composedInterestRate,
        totalFeeCostInPeriod: totalFeeCost,
        earned: result
      })
      
      return this.fromWei(result)
    },
    async getAPY() {
      if (!this.poolAllocPoint) {
        await this.getPoolInfo()
      }
      const contract = this.poolContract()
      
      let result = await contract.methods.cakePerBlock().call({ from: this.userAddress })
      const cakePerBlock = BN(result)
      
      const poolAllocPoint = BN(this.poolAllocPoint)
      
      result = await contract.methods.totalAllocPoint().call({ from: this.userAddress })
      const totalAllocPoint = BN(result)
      
      const blockReward = cakePerBlock.mul(poolAllocPoint).div(totalAllocPoint)
      const numberOfBlocks = 20 * 60 * 24 * 365 
      const annualBlockReward = blockReward.mul(BN(numberOfBlocks.toString())).mul(BN("1000000000000"))
      
      const cakeContract = this.cakeContract()
      result = await cakeContract.methods.balanceOf(contract.options.address).call({ from: this.userAddress })
      const lpSupply = BN(result)
      this.apy =  annualBlockReward.div(lpSupply).divRound(BN("100000000")).toNumber() / 100
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
  .results {
    table-layout: fixed;
  }
  .results .header td {
    font-weight: bold;
    text-transform: capitalize;
  }
  .results td {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .max {
    background-color: lightgreen
  }
  .row {
    width: 100%;
  }
  .row.alone {
    width: inherit;
  }
</style>