<template>
    <f7-page name="OrderSelect">
        <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
            <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center style="display: flex;align-items: center;">
                <span>OrderSelect</span>
            </f7-nav-center>
        </f7-navbar>
        <!-- Scrollable page content-->
        <main>OrderSelect
            <f7-list>
                <div v-if="orders.length" class="list-block">
                    <ul>
                        <li class="item-content" v-for="order in orders" :key="order.id">
                            <div class="item-inner" style="flex-direction: column;">
                                <div class="row pz-width100">
                                    <div class="col-30 color-gray pz-weight-thin">Order ID:</div>
                                    <div class="col-70">{{order.id}}</div>
                                </div>
                                <div class="row pz-width100">
                                    <div class="col-30 color-gray pz-weight-thin">City:</div>
                                    <div class="col-70">{{order.city}}</div>
                                </div>
                            </div>
                            <i
                                class="f7-icons pz-popover"
                                @click="openPopover(order, $event)"
                            >more_horiz</i>
                            <!-- <div class="item-after">
                                <span>
                                    <icon name="chevron-right"></icon>
                                </span>
                            </div>-->
                        </li>
                    </ul>
                </div>
                <div
                    class="color-gray"
                    style="text-align: center; font-style: italic;"
                    v-if="!orders.length && !$pzGlobalReactiveData.pendingReq"
                >No results found</div>
            </f7-list>
            <f7-popover :id="randomID">
                <div class="popover-inner">
                    <div class="list-block">
                        <a
                            @click="openPage('orderdetail')"
                            class="list-button item-link close-popover"
                        >Select to verify</a>
                        <!-- <a v-if="clickedOrder && clickedOrder.isPartiallyDispatched" @click="openPage('orderupdate')" class="list-button item-link close-popover">Update</a> -->
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
