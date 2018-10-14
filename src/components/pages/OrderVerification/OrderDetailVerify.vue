<template>
    <f7-page name="OrderDetailVerify">
        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>Verify Order</f7-nav-center>
        </f7-navbar>
        <main>
            <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="orderData">
                <list-item :label="'Order ID'" :value="orderData.id"/>
                <list-item :label="'City'" :value="city"/>
                <list-item :label="'Total Books'" :value="nbTotalBooks"/>
                <list-item :label="'Unique Titles'" :value="nbUniqueTitles"/>
                <button class="view-verified" @click="openVerifiedTitles()">View verified titles</button>
                <div class="btn-container">
                    <button
                        v-if="verifiedPct < 100"
                        submit
                        class="button button-fill button-raised color-bluegray"
                        @click="scanBook()"
                    >Scan to verify</button>
                    <button
                        v-if="verifiedPct < 100"
                        submit
                        class="button button-fill button-raised color-bluegray"
                    >Search to verify</button>
                    <button
                        v-if="verifiedPct >= VERIFICATION_THRESHOLD"
                        submit
                        class="button button-fill button-raised color-teal"
                    >Complete verification</button>
                </div>
            </section>
            <div class="verified-pct">
                <span class="text">Verification %</span>
                <span class="pct">{{this.verifiedPct}}</span>
                <!-- <div class="progress"></div> -->
                <f7-progressbar :progress="this.verifiedPct" :color="this.progressBarColor"></f7-progressbar>
            </div>
        </main>
    </f7-page>
</template>

<style scoped>
.btn-container {
  display: flex;
  flex-direction: column;
}
.btn-container button {
  margin: 10px 40px;
}
.verified-pct {
  box-sizing: border-box;
  background: antiquewhite;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
}
.verified-pct .text {
  color: white;
  z-index: 1;
}
.verified-pct .pct {
  color: white;
  z-index: 1;
}
.progressbar {
  position: absolute;
  height: -webkit-fill-available;
  top: 0;
  left: 0;
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
import ListItem from "../../shared/ListItem";

export default {
  name: "OrderDetailVerify",
  components: {
    "list-item": ListItem
  },
  data() {
    return {
      title: "OrderDetailVerify",
      orderData: null,
      VERIFICATION_THRESHOLD: 70
    };
  },
  computed: {
    city() {
      return window._pz.checkNested(this, "orderData", "user", "userAddress")
        ? this.orderData.user.userAddress.find(_ => _.address_type === 1).city
            .name
        : null;
    },
    nbTotalBooks() {
      return window._pz.checkNested(this, "orderData", "orderProduct")
        ? this.orderData.orderProduct.reduce(
            (sum, book) => sum + book.quantity,
            0
          )
        : null;
    },
    nbUniqueTitles() {
      return window._pz.checkNested(this, "orderData", "orderProduct")
        ? this.orderData.orderProduct.length
        : null;
    },
    verifiedPct() {
      // return 70;
      if (!window._pz.checkNested(this, "orderData", "orderProduct"))
        return null;

      const verifiedQty = this.orderData.orderProduct.reduce(
        (sum, book) => sum + book.verified_quantity,
        0
      );
      const verifiedpct = parseInt((verifiedQty / this.nbTotalBooks) * 100);
      return verifiedpct;
    },
    progressBarColor() {
      return this.verifiedPct < this.VERIFICATION_THRESHOLD ? "red" : "green";
    }
  },
  methods: {
    getOrderDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}orders/${this.orderId}`)
        .then(res => {
          if (res.ok) {
            this.orderData = res.body;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    scanBook() {
      window.vm.$pzGlobalReactiveData
        .scanCode()
        .then(res => {
          const scannedProductIsbn = res.text;
          if (scannedProductIsbn) {
            const scannedProductData = this.orderData.orderProduct.find(
              p => p.product.isbn === scannedProductIsbn
            );
            if (scannedProductData)
              window.vm.$f7.mainView.router.load({
                url: "VerifyProduct",
                context: {
                  bookData: scannedProductData,
                  orderId: this.orderId
                }
              });
            else
              window.vm.$f7.addNotification({
                message: "This book is not a part of the order",
                hold: 2000
              });
          } else
            window.vm.$f7.addNotification({
              message: "Could not scan the code",
              hold: 2000
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    openVerifiedTitles() {
      window.vm.$f7.mainView.router.load({
        url: "VerifiedTitles",
        context: {
          orderData: this.orderData
        }
      });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    if (window._pz.checkNested(this, "$route", "options", "context", "orderId"))
      this.orderId = this.$route.options.context.orderId;
    this.getOrderDetails();
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
