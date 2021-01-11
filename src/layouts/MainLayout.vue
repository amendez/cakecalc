<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-avatar square>
            <img src="~assets/cakecalc.png" width="48px" alt="CakeCalc">
          </q-avatar>
          CakeCalc
          <q-badge align="top" color="orange">0.4 BETA</q-badge>
        </q-toolbar-title>

        <q-btn
          round size="xs" icon="lightbulb"
          :class="{'text-black':$q.dark.isActive, 'text-white':!$q.dark.isActive}"
          :color="$q.dark.isActive?'white':'black'"
          @click="$q.dark.toggle()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu
        </q-item-label>
        <EssentialLink
          v-for="link in links"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="main-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      links: []
    }
  },
  mounted: function () {
    this.$i18n.locale = this.$q.lang.getLocale()
    this.links = [
      {
        title: this.$t('pancakeswap'),
        caption: this.$t('pancakeswap_link_caption'),
        icon: 'home',
        link: 'https://pancakeswap.finance/'
      },
      {
        title: this.$t('telegram_es_link'),
        caption: this.$t('telegram_es_caption'),
        icon: 'message',
        link: 'https://t.me/PancakeSwapES'
      },
      {
        title: this.$t('spreadsheet_calculator_link'),
        caption: this.$t('spreadsheet_calculator_caption'),
        icon: 'calculate',
        link: 'https://linktr.ee/pancakeswap'
      },
    ]
  }
}
</script>

<style>
  .q-page {
    padding: 10px;
  }
</style>