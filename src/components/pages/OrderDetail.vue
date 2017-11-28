<template>
  <f7-page name="OrderDetail">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>
        Order Detail
      </f7-nav-center>
    </f7-navbar>

    <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
      <list-item :label="'Status'">
        <span class="status pz-padding-lr16 ">{{statusText}}</span>
      </list-item>
      <list-item :label="'Order ID'" :value="data.order_id" />
      <list-item :label="'Mobile No'" :value="data.order_id">
        <a @click="$pzGlobalReactiveData.phone(data.user.mobile)">{{data.user.mobile}}</a>
      </list-item>
      <list-item :label="'Buyer Name'" :value="data.user.buyer_name" />
      <list-item :label="'Invoice Amt'" :value="data.finalOrderValue | moneyFormat" />
      <list-item :label="'Created Date'" :value="data.created_date | dateFormat" />
      <list-item v-if="dispatchData && dispatchData.carrierTransportationDays" :label="'Carrier'" :value="dispatchData.carrierTransportationDays.carrier.name" />

      <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest" v-if="biltyImage">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Bilty:</span>
        <div class="col-65">
          <img :src="biltyImage" class="pz-margin-r8 image" @click="$pzGlobalReactiveData.openZoomView(biltyImage)">
        </div>
      </div>

      <list-item v-if="dispatchData && dispatchData.cartons_number" :label="'# of cartons'" :value="dispatchData.cartons_number" />

      <section v-if="dispatchData && dispatchData.biltyDetails && dispatchData.carrierTransportationDays && dispatchData.carrierTransportationDays.carrier.name.toLowerCase() !== 'local transport'">
        <list-item :label="'GR Number'" :value="dispatchData.biltyDetails.gr_no" />
        <list-item :label="'Bilty type'" :value="$pzGlobalReactiveData.biltyTypeMap[dispatchData.biltyDetails.bilty_type]" />
        <list-item :label="'Freight Type'" :value="$pzGlobalReactiveData.freightTypeMap[dispatchData.biltyDetails.freight_type]" />
        <list-item :label="'Freight Charges'" :value="dispatchData.biltyDetails.freight_charges | moneyFormat" />
        <list-item :label="'Weight (in kgs)'" :value="dispatchData.biltyDetails.weight" />
        <list-item :label="'Value of goods'" :value="dispatchData.biltyDetails.goods_value | moneyFormat" />
      </section>

      <button v-if="isPartiallyDispatched" href="#" class="button button-raised color-teal pz-margin-r16 pz-padding-lr32 pz-float-r" @click="openUpdate()">Update order</button>

    </section>
    <section v-if="data && data.orderProduct && data.orderProduct.length">
      <f7-block-title>Books' details:</f7-block-title>
      <div class="data-table pz-margin-8 pz-shadow">
        <table class="equalDivide">
          <thead class="pz-bg-gray-lightest">
            <tr>
              <th style="width:1px;" class="numeric-cell">#</th>
              <th style="width:200px;" class="label-cell">Title</th>
              <th style="width:100px;" class="label-cell">Publisher</th>
              <th class="numeric-cell">MRP</th>
              <th class="numeric-cell pz-padding-0">QTY</th>
              <th class="numeric-cell pz-padding-0">Buy %</th>
              <th class="numeric-cell">Discount</th>
              <th class="numeric-cell pz-padding-0">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in data.orderProduct" :key="p.id">
              <td class="numeric-cell">{{index+1}}</td>
              <td class="label-cell">{{p.product.title}}</td>
              <td class="label-cell">{{p.product.publisher.name}}</td>
              <td class="numeric-cell">{{p.product.mrp | moneyFormat}}</td>
              <td class="numeric-cell">{{p.quantity}}</td>
              <td class="numeric-cell">{{p.procurement_discount}}%</td>
              <td class="numeric-cell">{{p.discount_percent}}</td>
              <td class="numeric-cell">{{p.amount | moneyFormat}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div class="color-gray pz-page-err" v-if="!data && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>

  </f7-page>
</template>

<style scoped>
.status {
  text-transform: uppercase;
  border: 1px solid green;
  border-radius: 5px;
  width: auto;
  color: #419688;
}

.equalDivide {
  table-layout: fixed !important;
  width: 1000px;
}

.row.pz-padding-tb-4.pz-padding-l16.pz-word-wrap-brk:nth-child(even) {
  background: #fafafa !important;
}
</style>
<script>
import ListItem from "../shared/ListItem";

export default {
  name: "OrderDetail",
  components: {
    "list-item": ListItem
  },
  data() {
    return {
      data: null,
      id: null,
      errMsg: null
    };
  },
  computed: {
    dispatchData() {
      return this.data && this.data.orderStatus && this.data.orderStatus.find(x => x.status_id === 5);
    },
    biltyImage() {
      if (!this.data || !this.data.orderStatus) return null;
      let dispatchData = this.data.orderStatus.find(x => x.status_id === 5);
      // ccbilty.png means the image is not there. Its a dummy hardcoded file name appended when the bilty type is CC bilty -_-
      if (!dispatchData || !dispatchData.bill_t_file_name || dispatchData.bill_t_file_name === 'ccbilty.png') return null;
      return window._pz.uploadsEndPt + "billt/" + dispatchData.bill_t_file_name;
    },
    isPartiallyDispatched() {
      return (
        this.data &&
        this.data.order_status === 5 && !this.data.orderStatus.some(el => el.status_id === 5 && el.carrierTransportationDays)
      );
    },
    statusText() {
      if (!this.data || !this.data.order_status) return null;
      else if (
        this.data.order_status === 5 &&
        typeof this.isPartiallyDispatched !== "undefined"
      ) {
        return this.isPartiallyDispatched
          ? "Part. Dispatched"
          : "Fully Dispatched";
      } else {
        switch (this.data.order_status) {
          case 1:
            return "Received";
          case 2:
            return "Confirmed";
          case 3:
            return "Being Procured";
          case 4:
            return "Being Packed";
          case 5:
            return "Dispatched"; // 5 could be for both partially and fully dispatched, so instead just say dispatched
          case 6:
            return "Fulfilled";
          case 0:
            return "Cancelled";

          default:
            return "ERR";
        }
      }
    }
  },
  methods: {
    getDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}orders/${this.id}`)
        .then(res => {
          if (res.ok) {
            this.data = res.body;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    openUpdate() {
      window.vm.$f7.mainView.router.load({ url: `orderupdate?id=${this.id}` });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.id = this.$route.query && this.$route.query.id;
    this.getDetails();
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
