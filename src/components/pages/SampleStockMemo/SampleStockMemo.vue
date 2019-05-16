<template>
  <f7-page
    name="SampleStockMemo"
    infinite-scroll
    @infinite="onInfiniteScroll"
    pull-to-refresh
    @ptr:refresh="onPullToRefresh"
  >
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>Sample Stock Memo</f7-nav-center>
    </f7-navbar>
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
      <div v-if="allMemos.length" class="list-block">
        <ul>
          <li class="item-content" v-for="memo in allMemos" :key="memo.id">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Doc no.:</div>
                <div class="col-70">{{memo.debit_note_number}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Value:</div>
                <div class="col-70">{{memo.value | moneyFormat}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Total qty:</div>
                <div class="col-70">{{memo.total_quantity}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Party:</div>
                <div class="col-70">{{memo.party.buyer_name}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Warehouse:</div>
                <div class="col-70">{{memo.warehouse.code}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Status:</div>
                <div class="col-70">{{memo.status}}</div>
              </div>
              <i class="f7-icons pz-popover" @click="openPopover(memo, $event)">more_horiz</i>
            </div>
            <div v-if="memo.badgeText" class="mybadge">{{memo.badgeText}}</div>
          </li>
        </ul>
      </div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="allMemos.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq"
      >Thats all folks!</div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="!allMemos.length && !$pzGlobalReactiveData.pendingReq"
      >No results found</div>
    </f7-list>
    <f7-popover :id="randomID">
      <div class="popover-inner">
        <div class="list-block">
          <a
            @click="uploadDispatchDetails()"
            class="list-button item-link close-popover"
          >Upload Dispatch Data</a>
        </div>
      </div>
    </f7-popover>
  </f7-page>
</template>

<style scoped>
</style>


<script>
export default {
  name: "SampleStockMemo",
  data() {
    return {
      allMemos: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      clickedOrder: null,
      randomID: Math.random()
        .toString(36)
        .substr(2, 10),
      filters: {
        search: [
          {
            placeholder: "Document number"
          }
        ],
        userSelect: null
      }
    };
  },
  computed: {
    filterQuery() {
      return "";
      // let filterQuery = "";

      // let { value: status = null } = this.filters.singleselect[0];
      // if (status !== null) filterQuery += `&status=${status}`;

      // let { value: dateRange = null } = this.filters.date[0];
      // if (dateRange !== null)
      //   filterQuery +=
      //     "&startDate=" + window.vm.moment(dateRange[0]).format("YYYY-MM-DD");
      // if (dateRange !== null && dateRange.length)
      //   filterQuery +=
      //     "&endDate=" + window.vm.moment(dateRange[1]).format("YYYY-MM-DD");

      // let { value: orderID = null } = this.filters.search[0];
      // if (orderID !== null) filterQuery += `&order_id=${orderID}`;

      // if (this.filters.userSelect)
      //   filterQuery += `&userId=${this.filters.userSelect}`;

      // return filterQuery;
    }
  },
  methods: {
    getAllMemos() {
      let url =
        `${window._pz.apiEndPt}debit_notes?type=4&limit=${this.limit}&offset=${
          this.offset
        }` + this.filterQuery;
      window.vm.$http
        .get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];
          this.allMemos = res.body;
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
        this.getAllMemos();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openAssignOrderPage() {
      const id = this.clickedOrder.id;
      const url = `AssignOrder?id=${id}`;
      window.vm.$f7.mainView.router.load({
        url: url
      });
    },
    openPopover(memo, e) {
      this.clickedOrder = memo;
      const popupID = "#" + this.randomID;
      window.vm.$pzGlobalReactiveData.openPopoverMenu(
        window.Dom7(popupID),
        e.target
      );
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
    // if (window._pz.checkNested(this, "$route", "options", "context", "comps")) {
    //   console.log(
    //     "this.$route.options.context.comps: ",
    //     JSON.stringify(this.$route.options.context.comps)
    //   );
    //   if (this.$route.options.context.comps instanceof Array) {
    //     // if selected filters are passed, like linking from dashboard page to only show the "open orders"
    //     const filter = this.$route.options.context.comps[0];
    //     const value = this.$route.options.context.comps[1];
    //     this.filters[filter] = value;
    //   } else {
    //     // if all filters are passed, like when coming from filters page
    //     this.filters = this.$route.options.context.comps;
    //   }
    // }
    this.getAllMemos();
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
