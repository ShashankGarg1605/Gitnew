<template>
  <f7-page name="ViewDispatchInfo">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Add Dispatch Info</f7-nav-center>
    </f7-navbar>
    <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="dispatchDetails">
      <list-item :label="'Doc no.'" :value="dispatchDetails.id"/>
      <list-item :label="'Value'" :value="dispatchDetails.value | moneyFormat"/>
      <list-item :label="'Total qty'" :value="dispatchDetails.total_quantity"/>
      <list-item :label="'Party'" :value="dispatchDetails.party.buyer_name"/>
      <list-item :label="'Warehouse'" :value="dispatchDetails.warehouse.code"/>
      <list-item
        :label="'Status'"
        :value="$pzGlobalReactiveData.memoStatusMap[dispatchDetails.status]"
      />
      <section>
        <div class="list-block">
          <ul>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="image"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">PoD/LR photo *</span>
                <image-uploader
                  :maxCount="1"
                  :inputTitles="false"
                  :tooltip="false"
                  :hideSubmitBtn="true"
                  @added="imageAdded($event, 'podlrImage')"
                />
              </div>
            </li>
            <single-select
              :value.sync="selectedMode"
              :placeholder="'Select mode of delivery *'"
              :opts="modeOptions"
            />
            <single-select
              :value.sync="selectedCarrier"
              :placeholder="'Select carrier *'"
              :opts="carrierOptions"
              :enableSearch="true"
              :searchPlaceholder="'Search carrier'"
            />
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Total cartons *</span>
                <input type="number" placeholder="Enter a number" v-model="cartonCount">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Strapped books *</span>
                <input type="number" placeholder="Enter a number" v-model="strappedBooksCount">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Freight Charges *</span>
                <input type="number" placeholder="Enter a number" v-model="freightCharges">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Door Delivery Charges</span>
                <input type="number" placeholder="Enter a number" v-model="doorDeliveryCharges">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Labour Charges</span>
                <input type="number" placeholder="Enter a number" v-model="labourCharges">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Local Delivery Charges</span>
                <input type="number" placeholder="Enter a number" v-model="localDeliveryCharges">
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Remarks</span>
                <textarea
                  type="text"
                  placeholder="Please enter as much detail as possible"
                  v-model="remarks"
                ></textarea>
              </div>
            </li>
          </ul>
          <div class="bottom">
            <button
              type="button"
              @click="submit()"
              class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
              :disabled="!canSubmit"
            >Submit</button>
          </div>
        </div>
      </section>
    </section>
  </f7-page>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

<script>
import ImageUploader from "../../shared/ImageUploader";
import ListItem from "../../shared/ListItem";
import FilterSingleSelect from "../../FilterSingleSelect";

export default {
  name: "AddDispatchInfo",
  components: {
    "image-uploader": ImageUploader,
    "single-select": FilterSingleSelect,
    "list-item": ListItem
  },
  data() {
    return {
      dispatchDetails: null,
      podlrImage: null,
      modeOptions: [],
      selectedMode: null,
      carrierOptions: [],
      selectedCarrier: null,
      cartonCount: null,
      strappedBooksCount: null,
      freightCharges: null,
      doorDeliveryCharges: null,
      labourCharges: null,
      localDeliveryCharges: null,
      remarks: null
    };
  },
  computed: {
    canSubmit() {
      return (
        this.podlrImage &&
        this.podlrImage.length &&
        this.selectedMode &&
        this.selectedCarrier &&
        this.freightCharges > 0 &&
        (this.cartonCount > 0 || this.strappedBooksCount > 0)
      );
    }
  },
  methods: {
    getDispatchDetails(memoId) {
      window.vm.$http
        .get(`${window._pz.apiEndPt}debit_notes/${memoId}`)
        .then(res => {
          if (!res.ok) return window._pz.errFunc2.bind(this);

          this.dispatchDetails = res.body;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    openPhotoBrowser(image) {
      window.vm.$f7
        .photoBrowser({
          type: "popup",
          theme: "dark",
          photos: [
            {
              url: `${window._pz.uploadsEndPt}samplememo/${image}`
            }
          ]
        })
        .open();
    },
    imageAdded(images, type) {
      this[type] = images;
    },
    setModeOfDeliveryOpts() {
      const map = window.vm.$pzGlobalReactiveData.dispatchModeMap;
      const out = [];
      Object.keys(map).forEach(key => {
        const obj = {
          label: map[key],
          value: key
        };
        out.push(obj);
      });
      this.modeOptions = out;
    },
    getCarriers() {
      window.vm.$http
        .get(window._pz.apiEndPt + "city/carriers")
        .then(res => {
          if (!res.ok) return;
          this.carrierOptions = res.body.map(carrier => ({
            label: `${carrier.carrier.name} (${carrier.city.name})`,
            value: carrier.carrier.id
          }));
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    submit() {
      window.vm.$f7.showPreloader();

      var params = {
        debitNotes: {
          id: this.dispatchDetails.id
        },
        dispatch_mode: this.selectedMode,
        carrier: { id: this.selectedCarrier },
        cartons: this.cartonCount,
        books: this.strappedBooksCount,
        freight_charges: this.freightCharges,
        door_delivery_charges: this.doorDeliveryCharges,
        labour_charges: this.labourCharges,
        local_delivery_charges: this.localDeliveryCharges,
        remarks: this.remarks,
        file: this.podlrImage[0].data
      };

      console.log("params: ", params);

      window.vm.$http
        .post(window._pz.apiEndPt + "debit_notes_dispatch", params)
        .then(res => {
          window.vm.$f7.hidePreloader();
          if (res.ok) {
            window.vm.$f7.addNotification({
              message: `Dispatch details added successfully!`,
              hold: 5000
            });
            window._pz.refreshOnBack = true;
            window.vm.$f7.mainView.router.back();
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
    if (window._pz.checkNested(this, "$route", "options", "context", "comps")) {
      this.dispatchDetails = this.$route.options.context.comps;
    } else {
      const memoId = this.$route.query && this.$route.query.id;
      this.getDispatchDetails(memoId);
    }
    this.setModeOfDeliveryOpts();
    this.getCarriers();
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

