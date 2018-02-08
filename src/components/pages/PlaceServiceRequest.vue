<template>
    <f7-page name="PlaceServiceRequest">

        <f7-navbar>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Place Service Request
            </f7-nav-center>
        </f7-navbar>

        <section v-if="users">
            <div class="list-block pz-margin-top0">
                <a href="#" id="autocomplete-standalone-popup-2" class="item-link item-content autocomplete-opener" @click="openUserSelection()">
                    <input type="hidden" v-model="userID">
                    <div class="item-inner">
                        <div class="item-title" v-if="!userID">Select User</div>
                        <div class="item-after" :class="{'pz-max-width100': userID, 'pz-width100': userID}"></div>
                    </div>
                </a>
            </div>
        </section>

        <section v-if="users && userID">

            <div class="list-block">
                <ul>

                    <li class="item-content button pz-colr-inherit pz-cap">
                        <div class="item-media">
                            <icon name="dot-circle-o"></icon>
                        </div>
                        <div class="item-inner pz-margin-l0">
                            <a href="#" class="item-link smart-select pz-width100" data-back-on-select="true">
                                <select v-model="selectedReason_id">
                                    <option v-for="(r, i) in reasons" :key="i" :value="r.id">{{r.text}}</option>
                                </select>
                                <div class="item-content pz-padding-l0 pz-size-normal text-container">
                                    <div>
                                        <span>Select Reason</span>
                                    </div>
                                    <span v-if="selectedReason_id" class="selected-values">{{selectedReason_text}}</span>
                                </div>
                            </a>
                            <div class="item-after">
                                <span>
                                    <icon name="chevron-right"></icon>
                                </span>
                            </div>
                        </div>
                    </li>

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
                        <image-uploader :maxCount="3" :inputTitles="false" :tooltip="false" :hideSubmitBtn="true" @added="imadeAdded($event)" @removed="imadeRemoved($event)" />
                    </li>
                    
                </ul>
                <div class="bottom">
                    <button type="button" @click="submit()" class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32" :disabled="!selectedReason_id || !description">Submit</button>
                </div>
            </div>

            
        </section>

        <div class="color-gray pz-page-err" v-if="!users && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>

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

export default {
  name: "PlaceServiceRequest",
  data() {
    return {
      users: null,
      userID: null,
      errMsg: null,
      autocompleteRef: null,
      reasons: [],
      selectedReason_id: null,
      description: null,
      images: []
    };
  },
  components: {
    "image-uploader": ImageUploader
  },
  computed: {
    selectedReason_text() {
      let selectedReason = this.reasons.find(r => r.id === this.selectedReason_id);
      return selectedReason && selectedReason.text;
    }
  },
  methods: {
    getAllUsers() {
      window.vm.$http
        .get(window._pz.apiEndPt + "users/list?type=2")
        .then(res => {
          console.log("res: ", res);
          if (res.ok) {
            this.users = res.body;
            this.setUserSelection();
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    setUserSelection() {
      let that = this; // save a ref to this to use inside callbacks
      this.autocompleteRef = window.vm.$f7.autocomplete({
        openIn: "popup", //open in popup
        opener: window.vm.Dom7("#autocomplete-standalone-popup-2"), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        textProperty: "name",
        autoFocus: true,
        valueProperty: "id",
        source(autocomplete, query, render) {
          if (query.length < 3) return;
          let results = [];
          if (query && query.length === 0) {
            render(results);
            return;
          }
          // Find matched items
          for (var i = 0; i < that.users.length; i++) {
            if (that.users[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(that.users[i]);
          }
          // Render items by passing array with result items
          render(results);
        },
        onChange(autocomplete, value) {
          // Add item text value to item-after
          window.vm
            .Dom7("#autocomplete-standalone-popup-2")
            .find(".item-after")
            .text(value[0].name);
          // Add item value to input value
          that.userID = value[0].id;
        },
        onClose() {
          window.f7.params.hideNavbarOnPageScroll = true;
        }
      });
    },
    openUserSelection() {
      window.f7.params.hideNavbarOnPageScroll = false;
      this.autocompleteRef.open();
    },
    getReasons() {
      window.vm.$http
        .get(window._pz.apiEndPt + "utils/reasons?type=7")
        .then(res => {
          console.log("res: ", res);
          if (res.ok) {
            this.reasons = res.body;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    imadeAdded(images) {
      console.log("imadeAdded: ", images);
      // just refer to the image uploader component's image array. Removing will happen automatically then.
      this.images = images;
    },
    imadeRemoved(images) {
      console.log("imadeRemoved: ", images);
      // no need to manually remove images from this page's props, since this.images directly references the image uploader component's images array
    },
    submit(images) {
      window.vm.$f7.showPreloader();

      var params = {
        reasonMaster: {
          id: this.selectedReason_id
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
            this.images = null;
            window.vm.$f7.mainView.router.load({
              url: "dashboard",
              reload: true
            });
          }
        })
        .catch(err => {
          window.vm.$f7.hidePreloader();
          this.images = null;
          window._pz.errFunc2.call(this, err);
        });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.getAllUsers();
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
  }
};
</script>
