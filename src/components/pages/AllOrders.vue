<template>
  <f7-page
    name="AllOrders"
    infinite-scroll
    @infinite="onInfiniteScroll"
    pull-to-refresh
    @ptr:refresh="onPullToRefresh"
  >
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>All Orders</f7-nav-center>
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
      <div v-if="allOrders.length" class="list-block">
        <ul>
          <li class="item-content" v-for="order in allOrders" :key="order.id">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Order ID:</div>
                <div class="col-70">{{order.order_id}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Buyer:</div>
                <div
                  class="col-70"
                >{{order.user.buyer_name}} ({{order.user.userAddress.find(c=>c.address_type===1).city.name}})</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Value:</div>
                <div class="col-70">{{order.finalOrderValue | moneyFormat}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Status:</div>
                <div class="col-70">{{order.statusText}}</div>
              </div>
              <i class="f7-icons pz-popover" @click="openPopover(order, $event)">more_horiz</i>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="allOrders.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq"
      >Thats all folks!</div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="!allOrders.length && !$pzGlobalReactiveData.pendingReq"
      >No results found</div>
    </f7-list>
    <f7-popover :id="randomID">
      <div class="popover-inner">
        <div class="list-block">
          <a @click="openPage('orderdetail')" class="list-button item-link close-popover">Details</a>
          <a
            @click="openAssignOrderPage()"
            class="list-button item-link close-popover"
            v-if="clickedOrder && clickedOrder.order_status === 3"
          >Assign Order</a>
          <!-- <a v-if="clickedOrder && clickedOrder.isPartiallyDispatched" @click="openPage('orderupdate')" class="list-button item-link close-popover">Update</a> -->
        </div>
      </div>
    </f7-popover>
  </f7-page>
</template>

<script>
export default {
  name: "AllOrders",
  data() {
    return {
      allOrders: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      clickedOrder: null,
      randomID: Math.random()
        .toString(36)
        .substr(2, 10),
      filters: {
        date: [
          {
            placeholder: "Chose date range",
            value: null
          }
        ],
        singleselect: [
          {
            placeholder: "Chose status",
            value: null,
            opts: [
              { label: "All", value: null },
              { label: "Received", value: "101" },
              // { label: "Confirmed", value: "102" },
              { label: "Being Procured", value: "102" },
              { label: "Being Packed", value: "103" },
              { label: "Partially Dispatched", value: "105" },
              { label: "Fully Dispatched", value: "114" },
              { label: "Fulfilled", value: "106" },
              { label: "Cancelled", value: "107" },
              { label: "Open", value: "113" }
            ]
          }
        ],
        search: [
          {
            placeholder: "Order ID:"
          },
          {
            placeholder: "User ID:"
          }
        ],
        userSelect: null
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = "";

      let { value: status = null } = this.filters.singleselect[0];
      if (status !== null) filterQuery += `&status=${status}`;

      let { value: dateRange = null } = this.filters.date[0];
      if (dateRange !== null) filterQuery += "&startDate=" + window.vm.moment(dateRange[0]).format("YYYY-MM-DD");
      if (dateRange !== null && dateRange.length) filterQuery += "&endDate=" + window.vm.moment(dateRange[1]).format("YYYY-MM-DD");

      let { value: orderID = null } = this.filters.search[0];
      if (orderID !== null) filterQuery += `&order_id=${orderID}`;

      if (this.filters.userSelect) filterQuery += `&userId=${this.filters.userSelect}`;
      else {
        let { value: userID = null } = this.filters.search[1];
        if (userID !== null) filterQuery += `&userId=${userID}`;
      }

      return filterQuery;
    }
  },
  methods: {
    getAllOrders() {
      window.vm.$pzGlobalReactiveData.loaderOnAllReqs = false;
      let url = `${window._pz.apiEndPt}orders?orderBy=created_date&orderByValue=desc&limit=${this.limit}&offset=${this.offset}` + this.filterQuery;
      window.vm.$http
        .get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];

          var data = res.body.map(order => {
            order.isPartiallyDispatched = order.order_status === 5 && !order.orderStatus.some(el => el.status_id === 5 && el.carrierTransportationDays);

            // if (typeof order.isPartiallyDispatched !== 'undefined') order.statusText = order.isPartiallyDispatched ? 'Partially dispatched' : 'Fully Dispatched';
            // else order.statusText = statusMapping[order.order_status];

            order.statusText = statusMapping[order.order_status];

            return order;
          });
          this.allOrders = this.allOrders.concat(data);
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
      if (this.offset % this.limit === 0 && !window.vm.$pzGlobalReactiveData.pendingReq) this.getAllOrders();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openPage(pageName) {
      const id = this.clickedOrder.id;
      const url = `${pageName}?id=${id}`;
      window.vm.$f7.mainView.router.load({
        url: url,
        context: { allOrdersFilters: this.filters } // send currently applied filters to the next page
      });
    },
    openAssignOrderPage() {
      const id = this.clickedOrder.id;
      const url = `AssignOrder?id=${id}`;
      window.vm.$f7.mainView.router.load({
        url: url
      });
    },
    openPopover(order, e) {
      this.clickedOrder = order;
      const popupID = "#" + this.randomID;
      window.vm.$f7.popover(window.Dom7(popupID), e.target);
      // window.dispatchEvent(new Event('resize'));
      // if the bug arises that popup is not visible, and it is visible only when window resize event fires
      // then you can trick the popup positioning re-calculation with this hack
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
    if (window._pz.checkNested(this, "$route", "options", "context", "comps")) {
      console.log("this.$route.options.context.comps: ", JSON.stringify(this.$route.options.context.comps));
      if (this.$route.options.context.comps instanceof Array) {
        // if selected filters are passed, like linking from dashboard page to only show the "open orders"
        const filter = this.$route.options.context.comps[0];
        const filterIdx = this.$route.options.context.comps[1];
        const value = this.$route.options.context.comps[2];
        this.filters[filter][filterIdx].value = value;
      } else {
        // if all filters are passed, like when coming from filters page
        this.filters = this.$route.options.context.comps;
      }
    }
    this.getAllOrders();
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

const statusMapping = {
  1: "Received",
  2: "Received",
  3: "Being procured",
  4: "Ready to dispatch",
  5: "Dispatched",
  6: "Fulfilled"
};
</script>
