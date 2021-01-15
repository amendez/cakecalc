<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted: function () {
    this.$i18n.locale = this.$q.lang.getLocale()
    this.$q.dark.set(this.$q.localStorage.getItem('use-dark-mode'))
  }
}
</script>
