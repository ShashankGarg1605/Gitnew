<template>
  <f7-page name="LandingPage">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center style="display: flex;align-items: center;">
        <span>Home</span>
        <img style="height: 30px;padding-left: 30px;" :src="tenantImage">
      </f7-nav-center>
    </f7-navbar>

    <ul>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('dashboard', 'read')"
        :icon="'line-chart'"
        :url="'/dashboard'"
        :label="'Dashboard'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('order', 'read')"
        :icon="'shopping-cart'"
        :url="'/allorders'"
        :label="'ISBN Orders'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('buyers', 'read')"
        :icon="'users'"
        :url="'/AllUsers'"
        :label="'Buyer Management'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('commpanel', 'read')"
        :icon="'user-o'"
        :url="'/CommunicationPanel'"
        :label="'Communications Panel'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('imageorders', 'read')"
        :icon="'image'"
        :url="'/AllImageOrders'"
        :label="'Image Orders'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('servicerequests', 'read')"
        :icon="'bug'"
        :url="'/PlaceServiceRequest'"
        :label="'Place Service Request'"
      ></menu-item>
      <menu-item
        v-if="$pzGlobalReactiveData.roleAccess('orderverification', 'read')"
        :icon="'check'"
        :url="'/OrderSearch'"
        :label="'Order Verification'"
      ></menu-item>
    </ul>
  </f7-page>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  border-bottom: 1px solid lightgrey;
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  color: #616161;
  padding: 15px 20px 15px 0px;
  font-weight: lighter;
  padding-left: 20px;
}
li:nth-child(even) {
  background: #FAFAFA;
}
li span:nth-child(3) {
  color: #bdbdbd;
}
</style>

<script>
var menuItem = {
  template: `<li @click="openPage(url)">
        <span>
          <icon :name="icon"></icon>
        </span>
        <span style="flex-grow: 1; margin-left: 20px;">{{label}}</span>
        <span>
          <icon name="chevron-right"></icon>
        </span>
      </li>`,
  props: ["icon", "url", "label"],
  methods: {
    openPage(page) {
      window.vm.$f7.mainView.router.loadPage(page);
    }
  }
};
export default {
  name: "LandingPage",
  data() {
    return {
      title: "LandingPage Page",
      tenantImage: JSON.parse(window.localStorage.tenantData).logo_lnk
    };
  },
  components: {
    "menu-item": menuItem
  },
  methods: {
    comingSoon() {
      window.vm.$f7.addNotification({
        message: "This feature is coming soon!",
        hold: 2000
      });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
  },
  beforeMount() {
    console.debug(this.$options.name + " beforeMount");
  },
  mounted() {
    console.debug(this.$options.name + " mounted");
  },
  beforeUpdate() {
    console.debug(this.$options.name + " beforeUpdate");
  },
  updated() {
    console.debug(this.$options.name + " updated");
  },
  beforeDestroy() {
    console.debug(this.$options.name + " beforeDestroy");
  },
  destroyed() {
    console.debug(this.$options.name + " destroyed");
  }
};
</script>
