<template>
  <div class="graph-container shadow-5">
    <chart :chart-data="chartData" :options="chartOptions"/>
  </div>
</template>

<script>
import Chart from '../components/Chart'
import { colors } from 'quasar'

function toPlainString(num) { // BN.js Throws from 1e+21 and above so using this make shift function
  return (''+num).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/,
    function(a,b,c,d,e) {
    return e < 0
      ? b + '0.' + Array(1-e-c.length).join(0) + c + d
      : b + c + d + Array(e-d.length+1).join(0);
    }
  );
}

export default {
  name: 'periods-chart',
  components: { Chart },
  props: {
    calculatedData: {
      type: Array,
      default: null
    },
    maxHours: {
      type: Object,
      default: null
    }
  },
  computed: {
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
  }
}
</script>

<style>
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