<template>
  <f7-page name="Filters">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Filters</f7-nav-center>
    </f7-navbar>
    <div class="content-block-title">You can apply multiple filters at once</div>
    <!-- <span style="font-size: xx-small;">{{comps}}</span> -->
    <div class="list-block">
      <ul>
        <li>
          <user-select
            :value.sync="comps.userSelect"
            :default="comps.userSelect"
            v-if="comps.userSelect !== undefined"
            class="pz-margin-0"
          />
        </li>
        <!-- <li class="item-content button pz-colr-inherit pz-cap">
          <div class="item-media">
            <icon name="calendar-o"></icon>
          </div>
          <div class="item-inner pz-margin-l0" style="padding-right: 0px;">
            <div style="width:100%;">
              <user-select :value.sync="comps.userSelect" v-if="comps.userSelect !== undefined" class="pz-margin-0" />
            </div>
          </div>
        </li>-->

        <pz-filter-date-range
          v-model="comp.value"
          v-for="(comp, index) in comps.date"
          :key="index"
          :placeholder="comp.placeholder"
        />
        <pz-filter-search
          :value.sync="comp.value"
          v-for="(comp, index) in comps.search"
          :key="index"
          :placeholder="comp.placeholder"
        />
        <pz-filter-single-select
          :value.sync="comp.value"
          v-for="(comp, index) in comps.singleselect"
          :key="index"
          :placeholder="comp.placeholder"
          :opts="comp.opts"
        />
      </ul>
    </div>
    <div class="bottom">
      <a
        href="#"
        class="button color-green pz-margin-r16 pz-padding-lr32"
        @click="resetFilters()"
      >Reset</a>
      <a
        href="#"
        class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
        @click="applyFilters()"
      >Apply</a>
    </div>
  </f7-page>
</template>

<style scoped>
#date::placeholder {
  color: inherit;
}

.bottom {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 65px;
  align-items: center;
  box-shadow: 0px 0px 1px 3px lightgrey;
  background: white;
  z-index: 15;
}
</style>


<script>
import FilterDateRange from "../FilterDateRange";
import FilterSingleSelect from "../FilterSingleSelect";
import FilterSearch from "../FilterSearch";
import UserSelect from "../shared/UserSelect";

export default {
  name: "Filters",
  data() {
    return {
      comps: null,
      userID: null
    };
  },
  components: {
    "pz-filter-date-range": FilterDateRange,
    "pz-filter-single-select": FilterSingleSelect,
    "pz-filter-search": FilterSearch,
    "user-select": UserSelect
  },
  methods: {
    applyFilters() {
      console.log("this.comps: ", JSON.stringify(this.comps));
      let prevPage =
        window.vm.$f7.mainView.history[
          window.vm.$f7.mainView.history.length - 2
        ];
      window.vm.$f7.mainView.router.load({
        url: prevPage,
        reload: true,
        context: { comps: this.comps }
      });
    },
    resetFilters() {
      for (let filterType of Object.keys(this.comps)) {
        if (
          this.comps[filterType] &&
          typeof this.comps[filterType] === "object"
        )
          for (let filter of this.comps[filterType]) {
            //eg first date type filter, then second date type filter
            filter.value = null;
          }
        else this.comps[filterType] = null;
      }
      this.applyFilters();
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.comps =
      this.$route.options.context && this.$route.options.context.comps;
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
