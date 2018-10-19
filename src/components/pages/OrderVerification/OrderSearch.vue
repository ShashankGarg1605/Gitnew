<template>
  <f7-page name="OrderSearch">
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
        <div>
          <div class="content-block-title">You can apply multiple filters at once</div>
          <label for="order-id">Enter Order ID:</label>
          <input type="number" v-model="orderId" name="order-id" placeholder="Last few digits">
        </div>
        <button submit class="button button-fill button-raised color-teal">Search</button>
      </form>
      <button
        class="view-verified"
        @click="openOrdersForVerification()"
      >View all orders for verification</button>
    </main>
  </f7-page>
</template>

<style scoped>
form {
  padding: 50px 20px 0px 20px;
}

form > div {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

input {
  border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 10px;
  margin-left: 5px;
  font-size: 1em;
}

button {
  margin: 20px auto;
  padding: 0px 40px;
}

.view-verified {
  text-decoration: underline;
  color: #5f7c8b;
  font-weight: bold;
  text-transform: capitalize;
  width: 100%;
  text-align: right;
  font-size: 14px;
  padding: 15px 20px 10px 0px;
}
</style>

<script>
export default {
  name: "OrderSearch",
  data() {
    return {
      title: "OrderSearch",
      orderId: null
      // orders: [
      //   {
      //     id: "xxx",
      //     city: "delhi"
      //   },
      //   {
      //     id: "yyy",
      //     city: "w delhi"
      //   }
      // ]
    };
  },
  methods: {
openOrdersForVerification() {
     window.vm.$http
        .get(`${window._pz.apiEndPt}orders?orderBy=created_date&orderByValue=desc&limit=100&offset=0&status=103`)
        .then(res => {
          if (res.ok) {
            console.log("res.body: ", res.body);
            const orders = res.body;
            window.vm.$f7.mainView.router.load({
              url: "OrderSelect",
              context: { orders }
            });
          }
        })
        .catch(window._pz.errFunc2.bind(this));
},
    onSubmit(e) {
      console.log(this.orderId);
      if (this.orderId) this.fetchOrders();
    },
    fetchOrders() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}orders?orderBy=created_date&orderByValue=desc&limit=20&offset=0&status=103&order_id=${this.orderId}`)
        .then(res => {
          if (res.ok) {
            console.log("res.body: ", res.body);
            const orders = res.body;
            window.vm.$f7.mainView.router.load({
              url: "OrderSelect",
              context: { orders }
            });
          }
        })
        .catch(window._pz.errFunc2.bind(this));
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
