<template>
  <f7-page
    name="Returns"
    infinite-scroll
    @infinite="onInfiniteScroll"
    pull-to-refresh
    @ptr:refresh="onPullToRefresh"
  >
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>Returns</f7-nav-center>
    </f7-navbar>
    <f7-fab
      color="pink"
      href="/InitiateReturn"
      v-if="$pzGlobalReactiveData.roleAccess('returns', 'create')"
    >
      <f7-icon icon="icon-plus"></f7-icon>
    </f7-fab>
    <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">Found {{totalCount}} results</div>
    <div style="overflow: hidden; margin: 16px 16px 16px;">
      <a
        href="#"
        class="button button-fill button-raised pz-flex-c-c pz-float-r"
        @click="openFilters()"
      >
        <icon name="filter"></icon>
        <span class="pz-padding-l16">Filter</span>
      </a>
    </div>
    <f7-list>
      <div v-if="allReturns.length" class="list-block">
        <ul>
          <li class="item-content" v-for="ret in allReturns" :key="ret.id">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Buyer:</div>
                <div class="col-65">{{ret.user.buyer_name}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Return ID:</div>
                <div class="col-65">{{ret.id}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Date:</div>
                <div class="col-65">{{ret.created_date}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Return value:</div>
                <div class="col-65">{{ret.return_value}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Approved value:</div>
                <div class="col-65">{{ret.approved_value}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Total books:</div>
                <div class="col-65">{{ret.returned_books}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-35 color-gray pz-weight-thin">Status:</div>
                <div
                  :class="`col-65 default-blue ${ret.statusText.toLowerCase()}`"
                >{{ret.statusText}}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="allReturns.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq"
      >Thats all folks!</div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="!allReturns.length && !$pzGlobalReactiveData.pendingReq"
      >No results found</div>
    </f7-list>
  </f7-page>
</template>

<style scoped>
.default-blue {
  color: blue;
}
.open {
  color: red;
}
.complete {
  color: green;
}
</style>

<script>
export default {
  name: "Returns",
  data() {
    return {
      allReturns: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      randomID: Math.random()
        .toString(36)
        .substr(2, 10),
      filters: {
        singleselect: [
          {
            placeholder: "Chose status",
            value: null,
            opts: [
              { label: "All", value: null },
              { label: "Open", value: "1" },
              { label: "Under process", value: "2" },
              { label: "Complete", value: "3" }
            ]
          }
        ],
        userSelect: null
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = "";

      // a. status select
      let { value: status = null } = this.filters.singleselect[0];
      if (status !== null) filterQuery += `&status=${status}`;

      // b. user filter
      if (this.filters.userSelect)
        filterQuery += `&user=${this.filters.userSelect}`;

      return filterQuery;
    }
  },
  methods: {
    getAllReturns() {
      window.vm.$pzGlobalReactiveData.loaderOnAllReqs = false;

      let url =
        `${
          window._pz.apiEndPt
        }returns?orderBy=created_date&orderByValue=desc&limit=${
          this.limit
        }&offset=${this.offset}` + this.filterQuery;
      window.vm.$http
        .get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];
          console.log("res.headers.map: ", res.headers.map);
          const data = res.body.map(ret => {
            ret.statusText =
              window.vm.$pzGlobalReactiveData.returnStatusMap[ret.status];
            return ret;
          });
          this.allReturns = this.allReturns.concat(data);
          this.offset += res.body.length;

          if (this.offset % this.limit !== 0) {
            this.removeInfiniteScroll();
          }
        })
        .catch(err => {
          this.removeInfiniteScroll();
          window._pz.errFunc2.call(this, err);
        });
    },
    onInfiniteScroll() {
      if (
        this.offset % this.limit === 0 &&
        !window.vm.$pzGlobalReactiveData.pendingReq
      )
        this.getAllReturns();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").show();
      this.hasReachedEnd = false;
    },
    removeInfiniteScroll() {
      window.vm.$f7.detachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").hide();
      this.hasReachedEnd = true;
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: "filters",
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    if (window._pz.checkNested(this, "$route", "options", "context", "comps"))
      this.filters = this.$route.options.context.comps;
    this.getAllReturns();
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
