<template>
  <f7-page name="AllOrders" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

    <f7-navbar sliding>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        All Orders
      </f7-nav-center>
    </f7-navbar>

    <!-- <div class="list-block pz-margin-top0">
                                                                                        <a href="#" class="item-link smart-select" data-open-in="picker" data-picker-height="400px" data-back-on-select="true">
                                                                                          <select name="fruits" @change="statusChange(this)" v-model="status">
                                                                                            <option value="000" selected>All</option>
                                                                                            <option value="101">Received</option>
                                                                                            <option value="102">Confirmed</option>
                                                                                            <option value="103">Being Procured</option>
                                                                                            <option value="104">Being Packed</option>
                                                                                            <option value="105">Partially Dispatched</option>
                                                                                            <option value="114">Fully Dispatched</option>
                                                                                            <option value="106">Fulfilled</option>
                                                                                            <option value="107">Cancelled</option>
                                                                                          </select>
                                                                                          <div class="item-content">
                                                                                            <div class="item-inner">
                                                                                              <div class="item-title">Chose status</div>
                                                                                            </div>
                                                                                          </div>
                                                                                        </a>
                                                                                      </div> -->

    <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">
      Found {{totalCount}} results
    </div>

    <div style="overflow: hidden; margin: 16px 16px 16px;">
      <a href="#" class="button button-fill button-raised pz-flex-c-c pz-float-r" @click="openFilters()">
        <icon name="filter"></icon>
        <span class="pz-padding-l16">Filter</span>
      </a>
    </div>

    <f7-list>
      <div v-if="allOrders.length" class="list-block">
        <ul>
          <li class="item-content" v-for="order in allOrders" :key="order.id" :class="{ redBg: order.needBiltyUpload}">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Order ID:</div>
                <div class="col-70">{{order.order_id}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Buyer:</div>
                <div class="col-70">{{order.user.buyer_name}} ({{order.user.userAddress[0].city.name}})</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Value:</div>
                <div class="col-70">Rs. {{order.finalOrderValue | moneyFormat}}</div>
              </div>
              <i v-if="!order.needBiltyUpload" class="f7-icons pz-popover" @click='openPopover(order.id, $event)'>more_horiz</i>

              <span v-if="order.needBiltyUpload" @click="openPage( 'orderdetail', order.id)">
                <icon class="pz-popover" name="cloud-upload" scale="1.5"></icon>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="allOrders.length && hasReachedEnd && !pendingReq">Thats all folks!</div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="!allOrders.length && !pendingReq">No results found</div>
    </f7-list>

    <f7-popover id="pz-popover-allorder">
      <div class="popover-inner">
        <div class="list-block">
          <a @click="openPage('orderdetail')" class="list-button item-link close-popover">View Details</a>
        </div>
      </div>
    </f7-popover>
  </f7-page>
</template>

<style scoped>
.pz-popover {
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 10px;
}

.redBg {
  background: #FFEBEE !important;
}
</style>

<script>
export default {
  name: 'AllOrders',
  data() {
    return {
      allOrders: [],
      limit: 20,
      offset: 0,
      pendingReq: false,
      hasReachedEnd: false,
      totalCount: null,
      filters: {
        date: [
          {
            placeholder: 'Chose date range',
            value: null
          }
        ],
        singleselect: [
          {
            placeholder: 'Chose status',
            value: null,
            opts: [
              { label: 'All', value: null },
              { label: 'Received', value: '101' },
              { label: 'Confirmed', value: '102' },
              { label: 'Being Procured', value: '103' },
              { label: 'Being Packed', value: '104' },
              { label: 'Partially Dispatched', value: '105' },
              { label: 'Fully Dispatched', value: '114' },
              { label: 'Fulfilled', value: '106' },
              { label: 'Cancelled', value: '107' }
            ]
          }
        ]
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = '';

      let { value: status = null } = this.filters.singleselect[0];
      if (status !== null) filterQuery += `&status=${status}`;

      let { value: dateRange = null } = this.filters.date[0];
      if (dateRange !== null) filterQuery += '&startDate=' + window.vm.moment(dateRange[0]).format('YYYY-MM-DD');
      if (dateRange !== null && dateRange.length) filterQuery += '&endDate=' + window.vm.moment(dateRange[1]).format('YYYY-MM-DD');

      return filterQuery;
    }
  },
  methods: {
    getAllOrders() {

      this.pendingReq = true;

      let url = `${window._pz.apiEndPt}orders?orderBy=created_date&orderByValue=desc&limit=${this.limit}&offset=${this.offset}` + this.filterQuery;
      // if (this.status && this.status !== '000') url += `&status=${this.status}`;
      window.vm.$http.get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];

          var data = res.body.map(order => {
            order.needBiltyUpload = order.order_status === 5 && !order.orderStatus.some(el => el.status_id === 5 && el.bill_t_file_name);
            return order;
          });
          this.allOrders = this.allOrders.concat(data);
          this.offset += res.body.length;
          this.pendingReq = false;

          if (this.offset % this.limit !== 0) {
            this.removeInfiniteScroll();
          }
        })
        .catch((err) => {
          if (err instanceof Error) throw new Error(err);

          this.pendingReq = false;
          this.removeInfiniteScroll();
        });
    },
    onInfiniteScroll() {
      if (this.offset % this.limit === 0 && !this.pendingReq) this.getAllOrders();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openPage(pageName, id) {
      id = id || window.Dom7('#pz-popover-allorder').data('pz-id');
      // window.vm.$f7.mainView.router.load({
      //   url: pageName,
      //   context: { id: id }
      // });
      let url = `${pageName}?id=${id}`;
      window.vm.$f7.mainView.router.loadPage(url);
    },
    openPopover(id, e) {
      window.vm.$f7.popover(window.Dom7('#pz-popover-allorder'), e.target);
      window.Dom7('#pz-popover-allorder').data('pz-id', id);
    },
    // statusChange() {
    //   console.log('this.status: ', this.status);
    //   this.allOrders = [];
    //   this.limit = 20;
    //   this.offset = 0;
    //   this.pendingReq = false;

    //   this.getAllOrders(this.status);
    // },
    // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').show();
      this.hasReachedEnd = false;
    },
    removeInfiniteScroll() {
      window.vm.$f7.detachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').hide();
      this.hasReachedEnd = true;
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: 'filters',
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    }
  },
  filters: {
    moneyFormat(data) {
      if (!data) return '';
      data = parseInt(data);
      data = data.toString();
      var lastThree = data.substring(data.length - 3);
      var otherNumbers = data.substring(0, data.length - 3);
      if (otherNumbers !== '') lastThree = ',' + lastThree;
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    }
  },

  beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
  created() {
    console.debug(this.$options.name + ' created');

    if (window._pz.checkNested(this, '$route', 'options', 'context', 'comps')) this.filters = this.$route.options.context.comps;
    this.getAllOrders();
  },
  beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
  mounted() { console.debug(this.$options.name + ' mounted'); },
  beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
  updated() { console.debug(this.$options.name + ' updated'); },
  beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
  destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
