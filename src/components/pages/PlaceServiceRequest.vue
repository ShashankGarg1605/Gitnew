<template>
  <f7-page name="PlaceServiceRequest">

    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Place Service Request
      </f7-nav-center>
    </f7-navbar>

    <user-select :value.sync="userID" />

    <section v-if="userID">

      <div class="list-block">
        <ul>

          <single-select :value.sync="selectedReason" :placeholder="'Select Reason'" :opts="reasons" />

          <li class="item-content pz-colr-inherit pz-cap">
            <div class="item-media">
              <icon name="pencil"></icon>
            </div>
            <div class="item-inner pz-margin-l0" style="align-items: left;     display: flex;     flex-direction: column;">
              <span class="pz-size-normal">
                Enter description
              </span>
              <textarea type="text" placeholder="Please enter as much detail as possible" v-model="description"></textarea>
            </div>
          </li>

          <li class="item-content pz-colr-inherit pz-cap" style="padding-right: 20px;     margin-top: 20px;">
            <div class="item-media">
              <icon name="image"></icon>
            </div>
            <image-uploader :maxCount="3" :inputTitles="false" :tooltip="false" :hideSubmitBtn="true" @added="imadeAdded($event)" />
          </li>

        </ul>
        <div class="bottom">
          <button type="button" @click="submit()" class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32" :disabled="!selectedReason">Submit</button>
        </div>
      </div>

    </section>

    <div class="color-gray pz-page-err" v-if="errMsg && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>

  </f7-page>
</template>

<style scoped>
.selected-values {
  position: absolute !important;
  left: 0px !important;
  bottom: -10px !important;
  color: #419688 !important;
  font-size: x-small !important;
}

.text-container {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  line-height: 37px !important;
}

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
import FilterSingleSelect from "../FilterSingleSelect";
import UserSelect from "../shared/UserSelect";

export default {
  name: "PlaceServiceRequest",
  data() {
    return {
      userID: null,
      errMsg: null,
      autocompleteRef: null,
      reasons: [],
      selectedReason: null,
      description: null,
      images: []
    };
  },
  components: {
    "image-uploader": ImageUploader,
    "single-select": FilterSingleSelect,
    "user-select": UserSelect
  },
  methods: {
    getReasons() {
      window.vm.$http
        .get(window._pz.apiEndPt + "utils/reasons?type=7")
        .then(res => {
          console.log("res: ", res);
          if (res.ok) {
            this.reasons = res.body.map(r => ({
              label: r.text,
              value: r.id
            }));
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    imadeAdded(images) {
      console.log("imadeAdded: ", images);
      // just refer to the image uploader component's image array. Removing will happen automatically then.
      this.images = images;
    },
    submit(images) {
      window.vm.$f7.showPreloader();

      var params = {
        reasonMaster: {
          id: this.selectedReason
        },
        description: this.description,
        user: {
          id: this.userID
        },
        status: 0
      };

      if (this.images && this.images.length) params.images = this.images.map(image => ({ name: "", stringValue: image.data }));

      window.vm.$http
        .post(window._pz.apiEndPt + "sr", params)
        .then(res => {
          window.vm.$f7.hidePreloader();
          if (res.ok) {
            window.vm.$f7.addNotification({ message: `Service request has been placed.`, hold: 5000 });
            window.vm.$f7.mainView.router.load({
              url: "dashboard",
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
    this.getReasons();
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
    this.images = null;
  }
};
</script>
