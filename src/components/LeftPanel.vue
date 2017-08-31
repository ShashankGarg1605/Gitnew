<template>
  <f7-panel left :reveal="isiOS" :cover="isMaterial">

    <div class="page pz-padding-0 pz-margin-0">
      <f7-navbar title="Menu"></f7-navbar>
      <div class="page-content pz-width100 pz-padding-t44" style="display: flex; flex-direction: column; ">

        <div class="list-block">
          <ul>
            <a class="item-content close-panel button pz-colr-inherit pz-cap" data-reload="true" href="/dashboard">
              <div class="item-media">
                <icon name="line-chart"></icon>
              </div>
              <div class="item-inner pz-margin-l0">
                <div class="item-title">Dashboard</div>
              </div>
            </a>
            <a class="item-content close-panel button pz-colr-inherit pz-cap" data-reload="true" href="/allorders">
              <div class="item-media">
                <icon name="shopping-cart"></icon>
              </div>
              <div class="item-inner pz-margin-l0">
                <div class="item-title">All Orders</div>
              </div>
            </a>
            <a class="item-content close-panel button pz-colr-inherit pz-cap" data-reload="true" href="/purchaseinvoice">
              <div class="item-media">
                <icon name="table"></icon>
              </div>
              <div class="item-inner pz-margin-l0">
                <div class="item-title">Purchase Invoice</div>
              </div>
            </a>
          </ul>
        </div>

        <div class="pz-height100 pz-flex-c-e pz-margin-b30">
          <a href="#" class="button button-raised close-panel pz-padding-lr16" @click="signOut()">Sign Out</a>
        </div>

      </div>
    </div>
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
@media (min-width: 960px) {
  .panel.panel-left {
    border-right: 1px solid #b2b2b2;
  }
}
</style>
