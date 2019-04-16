<template>
  <f7-page name="Procurement">
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>Procurement Discounts</f7-nav-center>
    </f7-navbar>

    <pub-select :selectedPub.sync="selectedPub"/>

    <section v-if="selectedPub && categories" class="proc">
      <div v-for="(c, i) in categories" :key="i" class="category">
        <span>{{c.category_name}}</span>
        <div
          class="sources"
          v-if="c.categoryProcurementJoin && c.categoryProcurementJoin.categoryProcurementInfo"
        >
          <span>Default Source:</span>
          <list-item
            :label="c.categoryProcurementJoin.categoryProcurementInfo.type === 2? c.categoryProcurementJoin.categoryProcurementInfo.distributors.distributor_name:selectedPub.name"
            :value="c.categoryProcurementJoin.categoryProcurementInfo.discount+'%'"
            :leftColWidth="80"
            :rightColWidth="20"
            styles="color:inherit"
          />
        </div>
        <div class="sources" v-if="c.categoryProcurementInfo && c.categoryProcurementInfo.length">
          <span>All sources:</span>
          <list-item
            v-for="(d, index) in c.categoryProcurementInfo"
            :key="index"
            :label="d.type === 2? d.distributors.distributor_name:selectedPub.name"
            :value="d.discount+'%'"
            :leftColWidth="80"
            :rightColWidth="20"
            styles="color:inherit"
          />
        </div>
        <div
          class="sources"
          v-if="!c.categoryProcurementInfo || !c.categoryProcurementInfo.length"
        >No results found</div>
      </div>
    </section>

    <div
      class="color-gray pz-page-err"
      v-if="errMsg && !$pzGlobalReactiveData.pendingReq"
    >{{errMsg}}</div>
  </f7-page>
</template>

<style scoped>
.category {
  padding: 16px 16px;
  border-bottom: 1px solid lightgrey;
}
.category > span {
  font-weight: bold;
}
.sources > span {
  color: #9e9e9e;
}
</style>


<script>
import PubSelect from "../shared/PubSelect";
import ListItem from "../shared/ListItem";

export default {
  name: "Procurement",
  data() {
    return {
      selectedPub: null,
      errMsg: null,
      categories: null
    };
  },
  components: {
    "pub-select": PubSelect,
    "list-item": ListItem
  },
  watch: {
    selectedPub() {
      this.getPubData(this.selectedPub.id);
    }
  },
  methods: {
    getPubData(pubID) {
      return window.vm.$http
        .get(
          window._pz.apiEndPt +
            `publisher_category?publisher=${pubID}&user=${
              window.vm.$pzGlobalReactiveData.userID
            }`
        )
        .then(res => {
          if (res.ok && res.body) this.categories = res.body;
        })
        .catch(window._pz.errFunc2.bind(this));
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
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
