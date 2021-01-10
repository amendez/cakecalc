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
          <q-badge align="top" color="orange">0.2 BETA</q-badge>
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
          v-for="link in essentialLinks"
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

const linksData = [
  {
    title: 'PancakeSwap',
    caption: 'PancakeSwap official website',
    icon: 'home',
    link: 'https://pancakeswap.finance/'
  },
  {
    title: 'Telegram español',
    caption: 'PancakeSwap official Telegram community',
    icon: 'message',
    link: 'https://t.me/PancakeSwapES'
  },
  {
    title: 'Spreadsheet calculator',
    caption: 'By Leodem',
    icon: 'calculate',
    link: 'https://linktr.ee/pancakeswap'
  },
  
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  mounted: function () {
    this.$i18n.locale = this.$q.lang.getLocale()
  }
}
</script>

<style>
  .q-page {
    padding: 20px;
  }
</style>