<template>
  <f7-panel left :reveal="isiOS" :cover="isMaterial">
    <div class="page pz-padding-0 pz-margin-0">
      <f7-navbar title="Menu"></f7-navbar>
      <div
        class="page-content pz-width100 pz-padding-t44"
        style="display: flex; flex-direction: column; "
      >
        <div class="list-block">
          <ul>
            <menu-item :icon="'home'" :url="'/LandingPage'" :label="'Home'"></menu-item>
            <menu-item
              :icon="'line-chart'"
              :url="'/dashboard'"
              :label="'Dashboard'"
              v-if="$pzGlobalReactiveData.roleAccess('dashboard', 'read')"
            ></menu-item>
            <menu-item
              :icon="'shopping-cart'"
              :url="'/allorders'"
              :label="'All Orders'"
              v-if="$pzGlobalReactiveData.roleAccess('order', 'read')"
            ></menu-item>
            <menu-item
              :icon="'image'"
              :url="'/AllImageOrders'"
              :label="'All Image Orders'"
              v-if="$pzGlobalReactiveData.roleAccess('imageorders', 'read')"
            ></menu-item>
            <menu-item
              :icon="'table'"
              :url="'/purchaseinvoice'"
              :label="'Purchase Invoice'"
              v-if="$pzGlobalReactiveData.roleAccess('inventory', 'read')"
            ></menu-item>
            <menu-item
              :icon="'users'"
              :url="'/AllUsers'"
              :label="'All Users'"
              v-if="$pzGlobalReactiveData.roleAccess('buyers', 'read')"
            ></menu-item>
            <menu-item
              :icon="'user-o'"
              :url="'/CommunicationPanel'"
              :label="'Communication Panel'"
              v-if="$pzGlobalReactiveData.roleAccess('commpanel', 'read')"
            ></menu-item>
            <menu-item
              :icon="'bug'"
              :url="'/PlaceServiceRequest'"
              :label="'Place Service Request'"
              v-if="$pzGlobalReactiveData.roleAccess('servicerequests', 'create')"
            ></menu-item>
            <menu-item
              :icon="'backward'"
              :url="'/Returns'"
              :label="'Returns'"
              v-if="$pzGlobalReactiveData.roleAccess('returns', 'read')"
            ></menu-item>
            <menu-item
              :icon="'check'"
              :url="'/OrderSearch'"
              :label="'Order Verification'"
              v-if="$pzGlobalReactiveData.roleAccess('orderverification', 'read')"
            ></menu-item>
          </ul>
        </div>
        <div class="sign-out pz-height100 pz-flex-c-e">
          <a
            href="#"
            class="button button-raised close-panel pz-padding-lr16"
            @click="signOut()"
          >Sign Out</a>
        </div>
      </div>
    </div>
  </f7-panel>
</template>

<style  scoped>
.sign-out {
  margin: 40px 0px;
}
</style>


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
