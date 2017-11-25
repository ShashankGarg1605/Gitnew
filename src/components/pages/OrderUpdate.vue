<template>
  <f7-page name="OrderUpdate">

    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>
        Update Order
      </f7-nav-center>
    </f7-navbar>

    <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="orderDetails">

      <list-item :label="'Order ID'" :value="orderDetails.order_id" />
      <list-item :label="'Buyer'" :value="orderDetails.user.buyer_name" :grayback="true" />
      <list-item :label="'Mobile No'">
        <a @click="$pzGlobalReactiveData.phone(orderDetails.user.mobile)">{{orderDetails.user.mobile}}</a>
      </list-item>

      <div class="row pz-padding-tb-4 pz-padding-l16 pz-bg-gray-lightest" v-if="carriers">
        <span class="col-35 color-gray pz-weight-thin ">Select Carrier</span>
        <span class="col-65 ">
          <a href="#" class="item-link smart-select" data-open-in="popup" data-back-on-select="true">
            <select name="carrier" v-model="selectedCarrier">
              <option v-for="c in carriers" :key="c.carrier.id" :value="c.carrier.id">{{c.carrier.name}}</option>
            </select>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-after">{{selCrrName || 'Tap here'}}</div>
              </div>
            </div>
          </a>
        </span>
      </div>

      <main v-if="selCrrName && selCrrName.toLowerCase() !== 'local transport'">
        <form @submit.prevent="validateBeforeSubmit" class="form" name="update">
          <div class="row pz-padding-tb-4 pz-padding-l16">
            <span class="col-35 color-gray pz-weight-thin ">Bilty type</span>
            <span class="col-65 ">
              <a href="#" class="item-link smart-select" data-open-in="popup" data-back-on-select="true">
                <select name="biltyType" v-model="biltyType" v-validate.initial="biltyType" data-vv-rules="required">
                  <option v-for="(value, key, index) in biltyTypes" :key="index" :value="key">{{value}}</option>
                </select>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-after">{{biltyType || 'Tap here'}}</div>
                  </div>
                </div>
              </a>
            </span>
            <p class="vald-msg" v-if="errors.has('biltyType')">Please input a correct value</p>
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest" v-if="biltyType">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Bilty Image:</span>
            <div class="col-65">
              <image-uploader :maxCount="1" @added="imadeAdded($event)" @removed="imadeRemoved($event)" :hideSubmitBtn="true" />
            </div>
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Dispatch date</span>
            <input type="text" id="datepick" name="datepick" class="col-65" placeholder="Tap here" v-model="dispatchDateReadable" v-validate.initial="dispatchDate" data-vv-rules="required">
            <p class="vald-msg" v-if="errors.has('dispatchDate')">Please input a correct value</p>
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">No. of cartons</span>
            <input type="number" name="nbCartons" class="col-65" placeholder="Tap here" v-model="nbCartons" v-validate.initial="nbCartons" data-vv-rules="required|numeric">
            <p class="vald-msg" v-if="errors.has('nbCartons')">Please input a correct value</p>
          </div>

          <div class="row pz-padding-tb-4 pz-padding-l16">
            <span class="col-35 color-gray pz-weight-thin ">Freight type</span>
            <span class="col-65 ">
              <a href="#" class="item-link smart-select" data-open-in="popup" data-back-on-select="true">
                <select name="freightType" v-model="freightType">
                  <option v-for="(value, key, index) in freightTypes" :key="index" :value="key">{{value}}</option>
                </select>
                <div class="item-content">
                  <div class="item-inner">
                    <div class="item-after">{{freightType || 'Tap here'}}</div>
                  </div>
                </div>
              </a>
            </span>
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">G.R. No.</span>
            <input type="number" name="grNb" class="col-65" placeholder="Tap here" v-model="grNb">
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Freight charges</span>
            <input type="number" name="freightCharges" class="col-65" placeholder="Tap here" v-model="freightCharges">
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Weight (in kg)</span>
            <input type="number" name="weight" class="col-65" placeholder="Tap here" v-model="weight">
          </div>

          <div class="row pz-padding-tb-4 pz-padding-lr16">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Value of goods</span>
            <input type="number" name="value" class="col-65" placeholder="Tap here" v-model="value">
          </div>

          <div class="bottom">
            <button type="button" href="#" class="button color-green pz-margin-r16 pz-padding-lr32" @click="$pzGlobalReactiveData.goBack()">Cancel</button>
            <button type="submit" href="#" class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32" :disabled="errors.any() || $pzGlobalReactiveData.pendingReq">Update</button>
          </div>
        </form>

      </main>

      <main v-if="selCrrName && selCrrName.toLowerCase() === 'local transport'">
        <form @submit.prevent="validateBeforeSubmit" class="form" name="update">
          <div class="row pz-padding-tb-4 pz-padding-lr16">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Dispatch date</span>
            <input type="text" id="datepick" name="datepick" class="col-65" placeholder="Tap here" v-model="dispatchDateReadable" v-validate.initial="dispatchDate" data-vv-rules="required">
            <p class="vald-msg" v-if="errors.has('dispatchDate')">Please input a correct value</p>
          </div>
          <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
            <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">No. of cartons</span>
            <input type="number" name="nbCartons" class="col-65" placeholder="Tap here" v-model="nbCartons" v-validate.initial="nbCartons" data-vv-rules="required|numeric">
            <p class="vald-msg" v-if="errors.has('nbCartons')">Please input a correct value</p>
          </div>
          <div class="bottom">
            <button type="button" href="#" class="button color-green pz-margin-r16 pz-padding-lr32" @click="$pzGlobalReactiveData.goBack()">Cancel</button>
            <button type="submit" href="#" class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32" :disabled="errors.any() || $pzGlobalReactiveData.pendingReq">Update</button>
          </div>
        </form>
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

.vald-msg {
  font-size: 12px;
  margin-top: 0px;
  color: red;
}

.selected-values {
  position: absolute !important;
  left: 0px !important;
  bottom: -10px !important;
  color: #419688 !important;
  font-size: x-small !important;
}

input,
input::placeholder {
  font-size: inherit;
  height: auto;
  color: #419688 !important;
  border: 0px;
}
</style>
<script>
import ImageUploader from "../shared/ImageUploader";
import ListItem from "../shared/ListItem";

let calendarInstance;

export default {
  name: "OrderUpdate",
  components: {
    "image-uploader": ImageUploader,
    "list-item": ListItem
  },
  data() {
    return {
      id: null,
      orderDetails: null,
      carriers: null,
      selectedCarrier: null,
      dispatchDate: null,
      nbCartons: null,
      biltyType: null,
      biltyTypes: window.vm.$pzGlobalReactiveData.biltyTypeMap,
      freightType: null,
      freightTypes: window.vm.$pzGlobalReactiveData.freightTypeMap,
      biltyImage: null,
      grNb: null,
      freightCharges: null,
      weight: null,
      value: null
    };
  },
  computed: {
    selCrrName() {
      if (!this.selectedCarrier || !this.carriers) return null;
      else {
        this.initDatePicker();
        const carrier = this.carriers.find(x => x.carrier.id === this.selectedCarrier);
        if (carrier) return carrier.carrier.name;
      }
    },
    dispatchDateReadable() {
      if (!this.dispatchDate || !this.dispatchDate.length) return null;
      return window.vm.moment(this.dispatchDate[0]).format('Do MMM YY');
    }
  },
  methods: {
    validateBeforeSubmit(e) {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.doUpdate();
      }
    },

    initDatePicker() {
      if (calendarInstance) return; // already initialized

      setTimeout(() => {
        calendarInstance = window.f7.calendar({
          input: '#datepick',
          dateFormat: 'd-M-yy',
          onChange: (comp, values, displayValues) => {
            this.dispatchDate = values;
          }
        });
      });

    },
    getOrderDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}orders/${this.id}`)
        .then(res => {
          if (res.ok) {
            this.orderDetails = res.body;

            if (window._pz.checkNested(res.body, "address", "city", "id")) this.getCarriers(res.body.address.city.id);
            const statusObj = res.body.orderStatus.find(_ => _.status_id === 5);
            if (statusObj) {
              this.dispatchDate = [window.vm.moment(statusObj.dispatch_date, 'DD-MM-YYYY HH:mm')._d];
              this.nbCartons = statusObj.cartons_number;
              this.selectedCarrier = window._pz.checkNested(statusObj, 'carrierTransportationDays', 'carrier', 'id') ? statusObj.carrierTransportationDays.carrier.id : null;
            }

          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getCarriers(cityID) {
      window.vm.$http
        .get(window._pz.apiEndPt + "city/carriers?city=" + cityID)
        .then(res => {
          if (res.ok) this.carriers = res.body;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    imadeAdded(image) {
      this.biltyImage = image[0].data;
    },
    imadeRemoved(image) {
      this.biltyImage = null;
    },
    doUpdate() {
      // bilty image is mandatory in case of physical and scanned bilty
      // put a hardcoded value in the case of CC bilty
      if ((this.biltyType === '1' || this.biltyType === '3') && !this.biltyImage)
        return window.f7.addNotification({ message: 'Please add the bilty image', hold: 2000 });
      else if (this.biltyType === '2' && !this.biltyImage) this.biltyImage = 'ccbilty.png';

      const params = {
        "order_status": 5,
        "order": {
          "id": this.orderDetails.id
        },
        "dispatch_date": window.vm.moment(this.dispatchDate[0]).format('DD-MM-YYYY 00:00'),
        "cartons_number": this.nbCartons,
        "carrier_fk_id": this.selectedCarrier,
        "biltyDetails": {
          "order": {
            "id": this.orderDetails.id
          },
          "bilty_type": this.biltyType,
          "weight": this.weight,
          "freight_type": this.freightType,
          "gr_no": this.grNb,
          "freight_charges": this.freightCharges,
          "goods_value": this.value,
          "is_deleted": 0
        },
        "bill_t_file_name": this.biltyImage
      };


      window.vm.$http.post(`${window._pz.apiEndPt}orders/bilty_details`, params)
        .then(res => {
          if (res.ok) {
            let allOrdersFilters;
            if (window._pz.checkNested(this.$route, 'options', 'context', 'allOrdersFilters')) {
              allOrdersFilters = this.$route.options.context.allOrdersFilters;
              console.log('allOrdersFilters: ', allOrdersFilters);
            }
            let prevPage = window.vm.$f7.mainView.history[window.vm.$f7.mainView.history.length - 2];
            window.vm.$f7.mainView.router.load({
              url: prevPage,
              reload: true,
              context: { comps: allOrdersFilters }
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
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  },
  destroyed() {
    console.debug(this.$options.name + " destroyed");
  }
};
</script>
