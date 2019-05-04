<template>
  <f7-page name="OrderPod">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Update Proof of Delivery</f7-nav-center>
    </f7-navbar>

    <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="orderDetails">
      <list-item :label="'Order ID'" :value="orderDetails.order_id"/>
      <list-item :label="'Buyer'" :value="orderDetails.user.buyer_name"/>
      <list-item :label="'Mobile No'">
        <a
          @click="$pzGlobalReactiveData.phone(orderDetails.user.mobile)"
        >{{orderDetails.user.mobile}}</a>
      </list-item>

      <main>
        <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
          <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">Image:</span>
          <div class="col-65">
            <image-uploader
              :maxCount="2"
              @added="imageAdded($event)"
              @removed="imageRemoved($event)"
              :hideSubmitBtn="true"
            />
          </div>
        </div>
        <div class="bottom">
          <button
            type="button"
            href="#"
            class="button color-green pz-margin-r16 pz-padding-lr32"
            @click="$pzGlobalReactiveData.goBack()"
          >Cancel</button>
          <button
            type="button"
            href="#"
            class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
            @click="doUpdate()"
            :disabled="$pzGlobalReactiveData.pendingReq"
          >Submit</button>
        </div>
      </main>
    </section>
  </f7-page>
</template>

<style scoped>
.bottom {
  display: flex;
  justify-content: flex-end;
  height: 65px;
  align-items: center;
}
</style>
<script>
import ImageUploader from "../shared/ImageUploader";
import ListItem from "../shared/ListItem";

export default {
  name: "OrderPod",
  components: {
    "image-uploader": ImageUploader,
    "list-item": ListItem
  },
  data() {
    return {
      id: null,
      orderDetails: null,
      images: []
    };
  },
  computed: {},
  methods: {
    getOrderDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}orders/${this.id}`)
        .then(res => {
          if (res.ok) {
            this.orderDetails = res.body;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    imageAdded(images) {
      this.images = images.map(img => img.data);
    },
    imageRemoved(images) {
      this.images = images.map(img => img.data);
    },
    doUpdate() {
      const params = {
        order: {
          id: this.orderDetails.id
        },
        bill_t_file_name: this.images[0]
      };

      window.vm.$f7.showPreloader();
      window.vm.$http
        .post(`${window._pz.apiEndPt}orders/bilty_details`, params)
        .then(res => {
          window.vm.$f7.hidePreloader();
          if (res.ok) {
            window.f7.addNotification({
              message: "Proof of delivery successfully uploaded",
              hold: 2000
            });

            const allOrdersFilters = window._pz.checkNested(
              this.$route,
              "options",
              "context",
              "allOrdersFilters"
            )
              ? this.$route.options.context.allOrdersFilters
              : null;
            const prevPage =
              window.vm.$f7.mainView.history[
                window.vm.$f7.mainView.history.length - 2
              ];
            window.vm.$f7.mainView.router.load({
              url: prevPage,
              reload: true,
              context: { comps: allOrdersFilters }
            });
          }
        })
        .catch(err => {
          window.vm.$f7.hidePreloader();
          window._pz.errFunc2.call(this, err);
        });
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");

    this.id = this.$route.query && this.$route.query.id;
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
