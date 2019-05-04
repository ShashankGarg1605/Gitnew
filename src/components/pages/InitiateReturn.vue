<template>
  <f7-page name="InitiateReturn">
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>Initiate Return</f7-nav-center>
    </f7-navbar>
    <user-select :value.sync="userID"/>
    <section v-if="userID">
      <div class="list-block">
        <ul>
          <single-select
            :value.sync="selectedWarehouse"
            :placeholder="'Select warehouse'"
            :opts="warehouses"
          />
          <date-range
            v-model="dates"
            :placeholder="'Start date'"
            :range="false"
            :maxDateToday="true"
          />
          <single-select
            :value.sync="selectedMethod"
            :placeholder="'Return method'"
            :opts="methods"
          />
          <template v-if="selectedMethod === 1">
            <text-search :value.sync="biltyNb" :placeholder="'Bilty Number'"/>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="image"></icon>
              </div>
              <div
                class="item-inner pz-margin-l0"
                style="align-items: left;     display: flex;     flex-direction: column;"
              >
                <span class="pz-size-normal">Bilty Image</span>
                <image-uploader
                  :maxCount="1"
                  :inputTitles="false"
                  :tooltip="false"
                  :hideSubmitBtn="true"
                  @added="imageAdded($event, 'biltyImage')"
                />
              </div>
            </li>
          </template>
          <li class="item-content pz-colr-inherit pz-cap">
            <div class="item-media">
              <icon name="image"></icon>
            </div>
            <div
              class="item-inner pz-margin-l0"
              style="align-items: left;     display: flex;     flex-direction: column;"
            >
              <span class="pz-size-normal">Debit note</span>
              <image-uploader
                :maxCount="1"
                :inputTitles="false"
                :tooltip="false"
                :hideSubmitBtn="true"
                @added="imageAdded($event, 'debitNoteImage')"
              />
            </div>
          </li>
          <li class="item-content pz-colr-inherit pz-cap">
            <div class="item-media">
              <icon name="pencil"></icon>
            </div>
            <div
              class="item-inner pz-margin-l0"
              style="align-items: left;     display: flex;     flex-direction: column;"
            >
              <span class="pz-size-normal">Return notes</span>
              <textarea
                type="text"
                placeholder="Please enter as much detail as possible"
                v-model="notes"
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
    <div
      class="color-gray pz-page-err"
      v-if="errMsg && !$pzGlobalReactiveData.pendingReq"
    >{{errMsg}}</div>
  </f7-page>
</template>

<style scoped>
textarea {
  display: block !important;
  padding: 10px !important;
  border: 1px dashed lightgrey !important;
  border-radius: 10px !important;
  background: #fafafa !important;
}

.bottom {
  display: flex;
  justify-content: flex-end;
  height: 65px;
  align-items: center;
}
</style>

<script>
import ImageUploader from "../shared/ImageUploader";
import FilterDateRange from "../FilterDateRange";
import FilterSingleSelect from "../FilterSingleSelect";
import FilterSearch from "../FilterSearch";
import UserSelect from "../shared/UserSelect";

export default {
  name: "InitiateReturn",
  data() {
    return {
      userID: null,
      errMsg: null,
      autocompleteRef: null,

      warehouses: null,
      selectedWarehouse: null,

      methods: [
        {
          label: "Sent by buyer with bilty",
          value: 1
        },
        {
          label: "Collected by us",
          value: 2
        },
        {
          label: "Books not received yet",
          value: 3
        }
      ],
      selectedMethod: null,

      biltyImage: null,
      biltyNb: null,

      debitNoteImage: null,

      dates: null,

      notes: null
    };
  },
  computed: {
    canSubmit() {
      if (!this.selectedMethod || !this.selectedWarehouse || !this.notes)
        return false;
      else if (
        this.selectedMethod === 1 &&
        (!this.biltyImage || !this.biltyImage.length || !this.biltyNb)
      )
        return false;
      else return true;
    }
  },
  components: {
    "image-uploader": ImageUploader,
    "date-range": FilterDateRange,
    "single-select": FilterSingleSelect,
    "text-search": FilterSearch,
    "user-select": UserSelect
  },
  methods: {
    getWarehouses() {
      window.vm.$http
        .get(window._pz.apiEndPt + "inventory/warehouses")
        .then(res => {
          if (!res.ok) return;

          if (window.vm.$pzGlobalReactiveData.warehouse) {
            const w = window.vm.$pzGlobalReactiveData.warehouse;
            this.warehouses = [
              {
                label: w.code,
                value: w.id
              }
            ];
          } else {
            this.warehouses = res.body.map(w => ({
              label: w.code + " " + w.address,
              value: w.id
            }));
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    imageAdded(images, type) {
      // just refer to the image uploader component's image array. Removing will happen automatically then.
      this[type] = images;
    },
    submit() {
      window.vm.$f7.showPreloader();

      var params = {
        user: {
          id: this.userID
        },
        warehouse: {
          id: this.selectedWarehouse
        },
        return_method: this.selectedMethod,
        start_date: window.vm.moment(this.dates[0]).format("YYYY-MM-DD"),
        description: this.notes,
        debit_note: this.debitNoteImage[0].data
      };

      if (this.selectedMethod === 1) {
        params.billty_number = this.biltyNb;
        params.billty = this.biltyImage[0].data;
      }
      console.log("params: ", params);

      window.vm.$http
        .post(window._pz.apiEndPt + "returns", params)
        .then(res => {
          window.vm.$f7.hidePreloader();
          if (res.ok) {
            window.vm.$f7.addNotification({
              message: `Return has been initiated has been placed.`,
              hold: 5000
            });
            window.vm.$f7.mainView.router.load({
              url: "Returns",
              reload: true
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
    this.getWarehouses();
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
    this.biltyImage = null;
    this.debitNoteImage = null;
  }
};
</script>
