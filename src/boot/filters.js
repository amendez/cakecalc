export default ({ Vue }) => {
  Vue.filter('round', function (value, decimals=2) {
    if(!value) {
      value = 0;
    }

    if(!decimals) {
      decimals = 0;
    }

    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return value;
  })

  Vue.filter('period', function (value) {
    if (value < 24) return value
    else return value / 24
  })
}