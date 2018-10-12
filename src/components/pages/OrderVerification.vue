<template>
  <f7-page name="Dashboard">
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center style="display: flex;align-items: center;">
        <span>OrderVerification</span>
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <main>
      <form @submit.prevent="onSubmit">
        <label for="order-id">Enter Order ID:</label>
        <input type="number" v-model="orderId" name="order-id" placeholder="just last 4 digits">
        <button
          submit
          class="button button-big button-fill button-raised color-teal pz-width100"
        >Search</button>
      </form>
    </main>
  </f7-page>
</template>

<style scoped>
</style>

<script>
export default {
  name: "OrderVerification",
  data() {
    return {
      title: "Dashboard Page",
      orderId: null,
      orders: [
        {
          id: "xxx",
          city: "delhi"
        },
        {
          id: "yyy",
          city: "w delhi"
        }
      ]
    };
  },
  methods: {
    onSubmit(e) {
      console.log(this.orderId);
      if (this.orderId) this.fetchOrders();
    },
    fetchOrders() {
      // window.vm.$http
      //   .get(`${window._pz.apiEndPt}orders/${this.orderId}`)
      //   .then(res => {
      //     if (res.ok) {
      //       console.log("res.body: ", res.body);
      //     }
      //   })
      //   .catch(window._pz.errFunc2.bind(this));
      window.vm.$f7.mainView.router.load({
        url: "OrderSelect",
        reload: true,
        context: { orders: this.orders }
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
