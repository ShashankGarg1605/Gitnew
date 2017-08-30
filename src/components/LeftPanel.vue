<template>
  <f7-panel left :reveal="isiOS" :cover="isMaterial">
    <f7-navbar title="Menu"></f7-navbar>
    <f7-page>
      <f7-block-title>Links</f7-block-title>
      <f7-list>
        <f7-list-item @click="signOut()" title="Sign Out" class="close-panel" />
        <f7-list-item link="/dashboard" title="Dashboard" link-view="#main-view" link-reload link-close-panel />
        <f7-list-item link="/allorders/" title="All Orders" link-view="#main-view" link-reload link-close-panel />
      </f7-list>
    </f7-page>
  </f7-panel>
</template>

<script>
export default {
  name: 'LeftPanel',
  data() {
    return {
      isMaterial: window.isMaterial,
      isiOS: window.isiOS
    };
  },
  methods: {
    signOut() {
      delete window.vm.$options.http.headers.Authorization;
      delete window.vm.$options.http.headers.tenant;
      window.localStorage.clear();
      window.vm.$f7.mainView.history = [];
      window.f7.mainView.router.loadPage('/');
    }
  }
};
</script>

<style scoped>
.panel-left .page {
  margin-top: 44px;
  padding-bottom: 44px;
}

@media (min-width: 960px) {
  .panel.panel-left {
    border-right: 1px solid #b2b2b2;
  }
}
</style>
