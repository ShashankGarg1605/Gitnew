<template>
  <f7-page name="ViewDispatchInfo">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>View Dispatch Info</f7-nav-center>
    </f7-navbar>
    <f7-fab color="pink" @click="addDispatchInfo()">
      <f7-icon icon="icon-plus"></f7-icon>
    </f7-fab>
    <div v-if="dispatchDetails ">
      <list-item :label="'Doc no.'" :value="dispatchDetails.id"/>
      <list-item :label="'Value'" :value="dispatchDetails.value | moneyFormat"/>
      <list-item :label="'Total qty'" :value="dispatchDetails.total_quantity"/>
      <list-item :label="'Party'" :value="dispatchDetails.party.buyer_name"/>
      <list-item :label="'Warehouse'" :value="dispatchDetails.warehouse.code"/>
      <list-item
        :label="'Status'"
        :value="$pzGlobalReactiveData.memoStatusMap[dispatchDetails.status]"
      />
    </div>

    <div
      v-if="dispatchDetails && dispatchDetails.debitNoteDispatch && dispatchDetails.debitNoteDispatch.length "
      class="list-block"
    >
      <span>Dispatch Details:</span>
      <ul>
        <li class="item-content" v-for="d in dispatchDetails.debitNoteDispatch" :key="d.id">
          <div class="item-inner" style="flex-direction: column;">
            <div class="row pz-width100">
              <div class="col-35 color-gray pz-weight-thin">Mode</div>
              <div class="col-65">{{$pzGlobalReactiveData.dispatchModeMap[d.dispatch_mode]}}</div>
            </div>
            <div class="row pz-width100" v-if="d.carrier">
              <div class="col-35 color-gray pz-weight-thin">Carrier</div>
              <div class="col-65">{{d.carrier.name}}</div>
            </div>
            <div class="row pz-width100">
              <div class="col-35 color-gray pz-weight-thin">Cartons</div>
              <div class="col-65">{{d.cartons}}</div>
            </div>
            <div class="row pz-width100">
              <div class="col-35 color-gray pz-weight-thin">Strapped units</div>
              <div class="col-65">{{d.books}}</div>
            </div>
            <div class="row pz-width100">
              <div class="col-35 color-gray pz-weight-thin">Door delivery charge</div>
              <div class="col-65">{{d.door_delivery_charges | moneyFormat}}</div>
            </div>
            <div class="row pz-width100">
              <div class="col-35 color-gray pz-weight-thin">Total charge</div>
              <div class="col-65">{{(getTotal(d)) | moneyFormat}}</div>
            </div>
            <div style="width: 100%">
              <span
                @click="openPhotoBrowser(d.file)"
                class="button pz-bg-gray-lightest image pz-flex-sa-c pz-margin-r16"
                style="float: left; margin-bottom: 10px;"
              >
                <icon name="image"></icon>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-if="!dispatchDetails || !dispatchDetails.debitNoteDispatch || !dispatchDetails.debitNoteDispatch.length "
      class="list-block"
    >no results found</div>
  </f7-page>
</template>

<style scoped>
</style>

<script>
import ListItem from "../../shared/ListItem";
export default {
  name: "ViewDispatchInfo",
  components: {
    "list-item": ListItem
  },
  data() {
    return {
      dispatchDetails: null
    };
  },
  methods: {
    getTotal(d) {
      return (
        parseFloat(d.door_delivery_charges || 0) +
        parseFloat(d.freight_charges || 0) +
        parseFloat(d.labour_charges || 0) +
        parseFloat(d.local_delivery_charges || 0)
      );
    },
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
              url: `${window._pz.uploadsEndPt}debitnotes/${image}`
            }
          ]
        })
        .open();
    },
    addDispatchInfo() {
      const url = `SampleStockMemo/AddDispatchInfo?id=${
        this.dispatchDetails.id
      }`;
      window.vm.$f7.mainView.router.load({
        url: url,
        context: { comps: JSON.parse(JSON.stringify(this.dispatchDetails)) }
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

