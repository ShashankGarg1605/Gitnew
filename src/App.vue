<template>
  <!-- App -->
  <div id="app" :class="platformClass">
    <!-- Status bar overlay for fullscreen mode-->
    <f7-statusbar/>
    <!-- Left Panel / View -->
    <!-- Load when component is mounted so that the vm instance.. -->
    <!-- ..(and importantly, the global reactive data, in turn).. -->
    <!-- ..is available to the side menu -->
    <left-panel-view v-if="mounted"/>
    <!-- Views-->
    <f7-views>
      <!-- Right view, it is main view-->
      <!-- Defaults to "/" route -->
      <f7-view
        :url="defaultPage()"
        :init="true"
        id="main-view"
        :dynamic-navbar="true"
        navbar-through
        main
      >
        <!-- Pages-->
        <f7-pages>
          <!-- Page, data-page contains page name-->
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
import LeftPanel from './components/LeftPanel';

export default {
  name: 'App',
  components: {
    'left-panel-view': LeftPanel
  },
  data() {
    return {
      mounted: false
    };
  },
  mounted: function () {
    this.mounted = true;
  },
  methods: {
    defaultPage() {
      return window.localStorage.authToken ? 'LandingPage' : '/';
    }
  },
  computed: {
    isiOS() {
      return window.isiOS;
    },
    platformClass() {
      return window.isiOS ? 'ios' : 'material';
    }
  }
};
</script>

<style>
/* style is not `scoped` so navbars in Pages are modified as well */

@media (min-width: 960px) {
  /* Let's hide panel-opener button when left panel is visible */
  .view-main .navbar .open-panel {
    display: none;
  }
}
</style>
