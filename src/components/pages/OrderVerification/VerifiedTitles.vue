<template>
    <f7-page name="VerifiedTitles">
        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>Verified Titles</f7-nav-center>
        </f7-navbar>
        <main>
            <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="orderData">
                <list-item :label="'Order ID'" :value="orderData.id"/>
            </section>
            <f7-list>
                <div v-if="verifiedTitles" class="list-block">
                    <ul>
                        <li class="item-content" v-for="title in verifiedTitles" :key="title.id">
                            <div class="item-inner" style="flex-direction: column;">
                                <div class="row pz-width100">
                                    <div>
                                        {{title.product.title}}
                                        <span
                                            class="money"
                                        >(MRP: {{title.product.mrp | moneyFormat}})</span>
                                    </div>
                                    <div class="verification-status">
                                        Verified
                                        <span>{{title.verified_quantity}}</span>qty out of
                                        <span>{{title.quantity}}</span>
                                    </div>
                                </div>
                            </div>
                            <i
                                class="f7-icons pz-popover"
                                @click="openPopover(title, $event)"
                            >more_horiz</i>
                        </li>
                    </ul>
                </div>
                <div
                    class="color-gray"
                    style="text-align: center; font-style: italic;"
                    v-if="!verifiedTitles && !$pzGlobalReactiveData.pendingReq"
                >No title has been verified yet</div>
            </f7-list>
            <f7-popover :id="randomID">
                <div class="popover-inner">
                    <div class="list-block">
                        <a @click="reverify()" class="list-button item-link close-popover">Re-verify</a>
                    </div>
                </div>
            </f7-popover>
        </main>
    </f7-page>
</template>

<style scoped>
.money {
  font-weight: bold;
  color: #757575;
}
.verification-status {
  color: #9e9e9e;
  font-style: italic;
}
.verification-status span {
  font-weight: bold;
  margin-right: 5px;
}
</style>

<script>
import ListItem from "../../shared/ListItem";

export default {
  name: "VerifiedTitles",
  components: {
    "list-item": ListItem
  },
  data() {
    return {
      title: "OrderDetailVerify",
      orderData: null,
      clickedTitle: null,
      randomID: Math.random()
        .toString(36)
        .substr(2, 10)
    };
  },
  computed: {
    verifiedTitles() {
      return (
        window._pz.checkNested(this, "orderData", "orderProduct") &&
        this.orderData.orderProduct.filter(p => p.verified_quantity)
      );
    }
  },
  methods: {
    openPopover(title, e) {
      this.clickedTitle = title;
      const popupID = "#" + this.randomID;
      window.vm.$f7.popover(window.Dom7(popupID), e.target);
    },
    reverify() {
      window.vm.$http
        .patch(`${window._pz.apiEndPt}order_product?updateType=verification`, {
          id: this.clickedTitle.id,
          verified_quantity: 0
        })
        .then(res => {
          if (res.ok) {
            window.vm.$f7.mainView.router.load({
              url: "VerifyProduct",
              context: {
                bookData: this.clickedTitle,
                orderId: this.orderData.id
              }
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
    if (
      window._pz.checkNested(this, "$route", "options", "context", "orderData")
    )
      this.orderData = this.$route.options.context.orderData;
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
