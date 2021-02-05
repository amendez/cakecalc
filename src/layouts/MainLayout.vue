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
          <q-badge align="top" color="orange">0.9 BETA</q-badge>
        </q-toolbar-title>

        <q-btn
          round size="xs" icon="lightbulb"
          :class="{'text-black':$q.dark.isActive, 'text-white':!$q.dark.isActive}"
          :color="$q.dark.isActive?'white':'black'"
          @click="toggleDarkMode"
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

    <footer>
      <hr>
      <div class="row justify-center q-gutter-sm">
        <q-btn
          flat
          icon="code"
          :label="$t('code_repo')"
          href="https://github.com/amendez/cakecalc"
          :color="$q.dark.isActive?'white':'black'"
          target="_blank"
          type="a"
        />
        <q-btn
          flat
          icon="message"
          :label="$t('telegram_community')"
          href="https://t.me/PancakeSwapES"
          :color="$q.dark.isActive?'white':'black'"
          target="_blank"
          type="a"
        />
      </div>
      <div class="row justify-center">
        <p class="text-caption text-weight-light text-center q-py-sm q-px-xl">
          <span class="text-weight-bold">{{ $t('important') }}:</span>
          {{ $t('disclaimer') }}
        </p>
      </div>
    </footer>
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
  },
  methods: {
    toggleDarkMode() {
      this.$q.dark.toggle()
      this.$q.localStorage.set('use-dark-mode', this.$q.dark.isActive)
    },
  }
}
</script>

<style>
  .q-page {
    padding: 10px;
  }
</style>