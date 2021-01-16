<template>
  <q-page class="flex flex-center">
    <q-dialog v-model="customAmountDialog" seamless position="top">
      <q-card style="width: 60%">
        <q-card-section class="row items-center no-wrap justify-around">
          <q-input
            outlined
            dense
            :value="Math.round(this.fromWei(amountToCalc))"
            @input="val => { customAmount = Math.max(1, val) }"
            style="max-width: 120px"
          >
            <template v-slot:prepend>
              {{ CAKE }}
            </template>
          </q-input>
          <q-slider
            :value="Math.round(this.fromWei(amountToCalc))"
            @change="val => { customAmount = val }"
            :min="Math.round((Math.max(1, this.fromWei(amountInPool) / 10)) / 100 ) * 100"
            :max="Math.round((Math.max(1000, this.fromWei(amountInPool) * 10)) / 100 ) * 100"
            :step="Math.round((Math.max(1, this.fromWei(amountInPool) / 2)) / 100) * 100"
            color="primary"
            label-always
            label
            class="q-ml-sm"
          />
          <q-space />
          <q-btn flat round icon="close" v-close-popup @click="customAmount = 0" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="row q-gutter-sm" :class="{'alone':!connected}" v-if="!customAmountDialog" >
      <div class="col-12 col-md" :class="{'col-md':connected, 'col-md':!connected}" >
        <q-card>
          <div v-if="connected && isBSC" class="swapsies"></div>
          <q-card-section class="text-white" :class="{'bg-secondary':!connected, 'bg-green':connected}">
            <div class="text-h6">{{ !connected ? $t("connect_your_wallet"): $t("wallet_connected") }}</div>
            <div class="text-subtitle2" v-if="!connected">
              {{ $t('please_connect') }}
            </div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn v-if="!connected" @click="connectWallet" color="primary" push icon="power">
              {{ $t('connect_wallet') }}
            </q-btn>
            <q-btn v-if="connected" @click="refreshAll" color="primary" push icon="refresh">
              {{ $t('refresh') }}
            </q-btn>
            <q-btn v-if="connected" @click="customAmountDialog = true" color="primary" push icon="edit">
              {{ $t('change_amount') }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="connected && !isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">{{ $t('error') }}</div>
            <div class="text-subtitle2">{{ $t('wrong_blockchain_error') }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="connected && isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">{{ $t('wallet_info') }}</div>
            <q-markup-table>
              <tbody>
                <tr>
                  <td class="text-left">{{ $t('address') }}</td>
                  <td class="text-right">{{ userAddress.substring(0,8) }}.....{{ userAddress.substring(34) }}</td>
                </tr>
                <tr>
                  <td class="text-left">{{ $t('bnb_balance') }}</td>
                  <td class="text-right">{{ fromWei(web3.balance) | round }}</td>
                </tr>
                <tr>
                  <td class="text-left">{{ $t('cake_balance') }}</td>
                  <td class="text-right">
                    {{ fromWei(amountToCalc) | round }}
                    <q-btn
                      color="primary"
                      icon="edit"
                      size="sm"
                      push round
                      @click="customAmountDialog = true"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="text-left">{{ CAKE }}{{ $t('cakes_to_harvest') }}</td>
                  <td class="text-right">{{ fromWei(pendingHarvest) | round }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="connected && isBSC" class="col-12 col-md">
        <q-card>
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">{{ $t('pool_info') }}</div>
            <q-markup-table>
              <tbody>
                <tr>
                  <td class="text-left">{{ $t('apy') }}</td>
                  <td class="text-right">{{ apy | round(4)}}%</td>
                </tr>
                <tr>
                  <td class="text-left">{{ $t('bnb_cake_rate') }}</td>
                  <td class="text-right">{{ fromWei(BNB_CAKERate) | round(4) }}</td>
                </tr>
                <tr>
                  <td class="text-left">{{ $t('bnb_gas_cost') }}</td>
                  <td class="text-right">{{ fromWei(estimatedGasInBNB) | round(4) }} BNB</td>
                </tr>
                <tr>
                  <td class="text-left">{{ $t('cake_gas_cost') }}</td>
                  <td class="text-right">{{ fromWei(estimatedGasInCAKE) | round(4) }} CAKE</td>
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
            <div class="text-h6">{{ $t('summary') }} {{ fromWei(amountToCalc) | round }} {{ CAKE }}!</div>
            <q-banner rounded class="shadow-5" :class="briefClass">
              <template v-slot:avatar>
                <img src="~assets/cake.svg" width="64px" alt="pancakes">
              </template>
              <span class="text-weight-bold">
                {{ $t('you_should_compund') }}
                <span class="text-green">
                  {{ maxHours.periodLengthInHours | period }} 
                  {{ (maxHours.periodLengthInHours >= 24)?$t('days'):$t('hours') }}
                </span>
                {{ $t('or_when_you_have') }}
                <span class="text-green"> 
                  {{ fromWei(maxHours.cakesByPeriod) | round }} CAKES
                </span>.
              </span>
            </q-banner>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="connected && isBSC && calculatedData.length">
      <br>
      <div class="col-12">
        <br>
        <q-card>
          <q-card-section class="bg-warning text-white">
            <div class="text-h6">{{ $t('line_graph') }} {{ fromWei(amountToCalc) | round }} {{ CAKE }}</div>
            <div class="graph-container shadow-5">
              <chart :chart-data="chartData" :options="chartOptions"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="connected && isBSC && calculatedData.length">
      <div class="col-12">
        <br>
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">{{ $t('detailed_results') }} {{ fromWei(amountToCalc) | round }} {{ CAKE }}</div>
            <q-markup-table class="results">
              <tbody>
                <tr class="header">
                  <td>{{ $t('period') }}</td>
                  <td>{{ $t('periods_a_month') }}</td>
                  <td>{{ $t('network_fee_in_cakes') }}</td>
                  <td>{{ $t('total_fee_cost_in_period') }}</td>
                  <td>{{ $t('period_interest_rate') }}</td>
                  <td>{{ $t('composed_interest_rate') }}</td>
                  <td>{{ $t('cakes_by_period') }}</td>
                  <td>{{ $t('earned') }}</td>
                </tr>
                <tr v-for="data in calculatedData" :key="data.periodLengthInHours" :class="{ max: (data.periodLengthInHours == maxHours.periodLengthInHours) }">
                  <td class="text-left">{{ buildPeriodName(data.periodLengthInHours) }} </td>
                  <td class="text-left">{{ data.periodCount | round(1) }}</td>
                  <td class="text-left">{{ fromWei(data.networkFeeInCakes) | round }} CAKE</td>
                  <td class="text-left">{{ fromWei(data.totalFeeCostInPeriod) | round(4)}} CAKE</td>
                  <td class="text-left">{{ data.periodInterestRate | round(4) }}</td>
                  <td class="text-left">{{ data.composedInterestRate | round(4) }}</td>
                  <td class="text-left">{{ fromWei(data.cakesByPeriod) | round }} CAKE</td>
                  <td class="text-left">{{ fromWei(data.earned) | round }} CAKE</td>
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
import Chart from '../components/Chart'
import { colors } from 'quasar'

const BNObject = Web3.utils.BN;
const POOL_INDEX = 0
const GAS_COST = 20
const BN = (x) => new BNObject(x)

export default {
  name: 'cakeculator',
  components: { Chart },
  data: function () {
    return {
      connected: false,
      isBSC: true,
      amountInPool: undefined,
      customAmount: 0,
      poolAllocPoint: 0,
      estimatedGasInBNB: 0,
      BNB_CAKERate: 0,
      pendingHarvest: 0,
      apy: 0,
      calculatedData: [],
      customAmountDialog: false,
      hours: [
        1,2,3,4,5,6,12,18,24,30,36,42,48,60,72,84,96,
        (12*9),12*10,24*6,24*7,24*8,24*9,24*10,24*15,24*20,24*25,24*30
      ],
      errorMessage: "",
    }
  },
  computed: {
    ...mapGetters('store', {
      'web3': 'getWeb3',
      'poolContract': 'getPoolContract',
      'cakeContract': 'getCakeContract',
      'swapContract': 'getSwapContract',
    }),
    CAKE(){
      return "🥞"
    },
    userAddress(){
      return this.web3.coinbase
    },
    amountToCalc(){
      return this.customAmount ? this.toWei(this.customAmount) : this.amountInPool
    },
    estimatedGasInCAKE() {
      return this.toWei(this.fromWei(this.estimatedGasInBNB) * this.fromWei(this.BNB_CAKERate))
    },
    maxHours() {
      let max = {earned: 0}
      this.calculatedData.forEach(data => max = (data.earned > max.earned)?data:max)
      return max
    },
    briefClass() {
      let classes = ['bg-white', 'text-black']
      if (this.$q.dark.isActive) {
        classes = ['q-dark']
      }
      return classes
    },
    chartOptions(){
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: this.$t('graph_title')
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.$t('graph_x_label')
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: this.$t('graph_y_label')
            }
          }]
        }
      }
    },
    chartData() {
      return {
        labels: this.calculatedData.map(elem => this.buildPeriodName(elem.periodLengthInHours)),
        datasets: [
          {
            data: this.calculatedData.map(elem => this.$options.filters.round(this.fromWei(elem.earned), 2)),
            label: this.$t('graph_dataset_1_label'),
            borderColor: colors.getBrand('primary'),
            fill: true,
            lineTension: 0.1,
          },
          {
            label: this.$t('graph_dataset_2_label'),
            backgroundColor: colors.getBrand('primary'),
            data: this.calculatedData.map(elem => elem.periodLengthInHours == this.maxHours.periodLengthInHours?this.fromWei(elem.earned):null ),
            pointRadius: 10,
            pointHoverRadius: 15,
            showLine: false
          }
        ]
      }
    }
  },
  watch: {
    amountToCalc: async function () {
      this.calculatedData = []
      await this.doCalcs()
    },
  },
  async mounted () {
    const connected = this.$q.localStorage.getItem('account-connected')
    if (connected === 'true') {
      await this.connectWallet()
    }
  },
  methods: {
    buildPeriodName(number) {
      const formatedNumber = this.$options.filters.round(this.$options.filters.period(number), 2)
      const unit  = (number >= 24)?this.$t('days'):this.$t('hours')
      return `${formatedNumber} ${unit}`
    },
    fromWei(number) {
      return number?web3.utils.fromWei(toPlainString(number)):0
    },
    toWei(number) {
      const strNumber = number.toString().substring(0, 20)
      return number?web3.utils.toWei(strNumber):0
    },
    async connectWallet() {
      this.startLoading()
      try {
        await this.$store.dispatch('store/registerWeb3')
        await this.$store.dispatch('store/getContractInstance')
        this.connected = this.web3.isInjected
        this.isBSC = this.web3.networkId == 56
        this.getUserInfo()
      }
      catch (error) {
        this.errorMessage = error
        setTimeout(this.connectWallet, 2000)
      }
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
      const defaultGas = 157704
      let gas
      if (!this.pendingHarvest) {
        await this.getPendingCake()
      }

      try {
        gas = await this.poolContract().methods.enterStaking(this.pendingHarvest || 1).estimateGas({from: this.userAddress})
        gas = Math.max(gas, defaultGas)
      }
      catch (err) {
        gas = defaultGas
      }
      
      this.estimatedGasInBNB = this.toWei(gas * GAS_COST * 0.000000001)
    },
    async getConversionRate() {
      const rate = await this.swapContract().methods.getAmountsIn(this.toWei(1), ["0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82","0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"]).call({ from: this.userAddress })
      this.BNB_CAKERate = rate[0]
    },
    async doCalcs() {
      this.startLoading()
      for (const hour of this.hours) {
        await this.doCalc(hour)
      }
      while (this.calculatedData.length < 5 && this.amountToCalc) {
        const newHour = this.hours[this.hours.length-1] + (24 * 30)
        this.hours.push(newHour)
        await this.doCalc(newHour)
      }
      this.stopLoading()
    },
    async doCalc(hours = 1) {
      if (!this.apy) {
        await this.getAPY()
      }
      if (!this.amountInPool) {
        await this.getUserInfo()
      }
      if (!this.pendingHarvest) {
        await this.getPendingCake()
      }
      if (!this.estimatedGasInCAKE) {
        await this.estimateGas()
        await this.getConversionRate()
      }

      const periodInterestRate = ((this.apy / 365 / 24) * hours) / 100 + 1
      const periodCount = 720 / hours
      const investedAmount = this.amountToCalc
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
      
      if (result < 0) {
        return 0
      }
      
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
    },
    async refreshAll() {
      this.poolAllocPoint = 0
      this.estimatedGasInBNB = 0
      this.BNB_CAKERate = 0
      this.pendingHarvest = 0
      this.apy = 0
      this.calculatedData = []
      this.customAmount = 0
      await this.getUserInfo()
      await this.doCalcs()
    },
    startLoading() {
      this.$q.loading.show({
        message: this.$t('loading_message') + " " + this.errorMessage
      })
    },
    stopLoading() {
      this.$q.loading.hide()
    },
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
  .swapsies {
    height:140px;
    background-image: url("~assets/swapsies.png");
    background-size: cover;
    background-position-x: center;
    background-position-y: top;
  }
  .body--dark .graph-container {
    background-color: #333;
  }
  .graph-container {
    background-color: white;
    border-radius: 4px;
    height: 400px;
    position: relative;
    vertical-align: middle;
  }
</style>