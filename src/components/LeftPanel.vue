<template>
  <f7-panel left :reveal="isiOS" :cover="isMaterial">

    <div class="page pz-padding-0 pz-margin-0">
      <f7-navbar title="Menu"></f7-navbar>
      <div class="page-content pz-width100 pz-padding-t44" style="display: flex; flex-direction: column; ">

        <div class="list-block">
          <ul>
            <menu-item :icon="'home'" :url="'/LandingPage'" :label="'Home'"></menu-item>
            <menu-item :icon="'line-chart'" :url="'/dashboard'" :label="'Dashboard'"></menu-item>
            <menu-item :icon="'shopping-cart'" :url="'/allorders'" :label="'All Orders'"></menu-item>
            <menu-item :icon="'image'" :url="'/AllImageOrders'" :label="'All Image Orders'"></menu-item>
            <menu-item :icon="'table'" :url="'/purchaseinvoice'" :label="'Purchase Invoice'"></menu-item>
            <menu-item :icon="'users'" :url="'/AllUsers'" :label="'All Users'"></menu-item>
            <menu-item :icon="'user-o'" :url="'/CommunicationPanel'" :label="'Communication Panel'"></menu-item>
            <menu-item :icon="'bug'" :url="'/PlaceServiceRequest'" :label="'Place Service Request'"></menu-item>
            <menu-item :icon="'backward'" :url="'/InitiateReturn'" :label="'Initiate Return'"></menu-item>
	    <menu-item :icon="'backward'" :url="'/OrderVerification'" :label="'Order Verification'"></menu-item>
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
var menuItem = {
  template: `<a class="item-content close-panel button pz-colr-inherit pz-cap" data-reload="true" @click="openPage(url)">
              <div class="item-media"> <icon :name="icon"></icon> </div>
              <div class="item-inner pz-margin-l0">
                <div class="item-title">{{label}}</div>
              </div>
            </a>`,
  props: ["icon", "url", "label"],
  methods: {
    openPage(name) {
      // a left menu click means a new navigational stack, hence delete all history
      // window.vm.$f7.mainView.history = [];
      window.vm.$f7.mainView.router.loadPage({
        url: name,
        reload: true
      });
    }
  }
};
export default {
  name: "LeftPanel",
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
      window.vm.$f7.mainView.router.loadPage({
        url: "/",
        reload: true
      });
    }
  },
  components: {
    "menu-item": menuItem
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
