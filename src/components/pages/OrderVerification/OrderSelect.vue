<template>
    <f7-page name="OrderSelect">
        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>Select order to verify</f7-nav-center>
        </f7-navbar>
        <!-- <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
            <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center style="display: flex;align-items: center;">
                <span>Select order to verify</span>
            </f7-nav-center>
        </f7-navbar>-->

        <!-- Scrollable page content-->
        <main>
            <f7-list>
                <div v-if="orders && orders.length" class="list-block">
                    <ul>
                        <li class="item-content" v-for="order in orders" :key="order.id">
                            <div class="item-inner" style="flex-direction: column;">
                                <div class="row pz-width100">
                                    <div class="col-30 color-gray pz-weight-thin">Order ID:</div>
                                    <div class="col-70">{{order.id}}</div>
                                </div>
                                <div class="row pz-width100">
                                    <div class="col-30 color-gray pz-weight-thin">City:</div>
                                    <div
                                        class="col-70"
                                    >{{order.user.userAddress.find(_=>_.address_type===1).city.name}}</div>
                                </div>
                                <div class="row pz-width100">
                                    <div class="col-30 color-gray pz-weight-thin">Status:</div>
                                    <div
                                        class="col-70"
                                    >{{$pzGlobalReactiveData.verificationStatusMap[order.verification_status]}}</div>
                                </div>
                            </div>
                            <i
                                v-if="order && order.verification_status !== 2"
                                class="f7-icons pz-popover"
                                @click="openPopover(order, $event)"
                            >more_horiz</i>
                        </li>
                    </ul>
                </div>
                <div
                    class="color-gray"
                    style="text-align: center; font-style: italic;"
                    v-if="(!orders || !orders.length) && !$pzGlobalReactiveData.pendingReq"
                >No results found</div>
            </f7-list>
            <f7-popover :id="randomID">
                <div class="popover-inner">
                    <div
                        v-if="clickedOrder && clickedOrder.verification_status === 0"
                        class="list-block"
                    >
                        <a
                            @click="startVerification()"
                            class="list-button item-link close-popover"
                        >Start verification</a>
                    </div>
                    <div
                        v-if="clickedOrder && clickedOrder.verification_status === 1"
                        class="list-block"
                    >
                        <a
                            @click="goToOrderDetails()"
                            class="list-button item-link close-popover"
                        >Resume verification</a>
                    </div>
                </div>
            </f7-popover>
        </main>
    </f7-page>
</template>

<style scoped>
</style>

<script>
export default {
  name: "OrderSelect",
  data() {
    return {
      title: "OrderSelect",
      orders: null,
      clickedOrder: null,
      randomID: Math.random()
        .toString(36)
        .substr(2, 10)
    };
  },
  methods: {
    openPopover(order, e) {
      this.clickedOrder = order;
      const popupID = "#" + this.randomID;
      window.vm.$f7.popover(window.Dom7(popupID), e.target);
    },
    startVerification() {
      window.vm.$http
        .patch(
          `${window._pz.apiEndPt}orders?updateType=verification&id=${
            this.clickedOrder.id
          }&verification_status=1`
        )
        .then(res => {
          if (res.ok) this.goToOrderDetails();
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    goToOrderDetails() {
      window.vm.$f7.mainView.router.load({
        url: "OrderDetailVerify",
        context: { orderId: this.clickedOrder.id }
      });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    if (window._pz.checkNested(this, "$route", "options", "context", "orders"))
      this.orders = this.$route.options.context.orders;
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
