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

    <div class="list-block pz-margin-top0">
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
                <div class="col-70">{{order.user.buyer_name}} ({{order.user.userAddress[0].city.name}})</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Value:</div>
                <div class="col-70">Rs. {{order.finalOrderValue | moneyFormat}}</div>
              </div>
              <i class="f7-icons pz-popover" @click='openPopover(order.id, $event)'>more_horiz</i>
            </div>
          </li>
        </ul>
      </div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="allOrders.length && hasReachedEnd && !pendingReq">Thats all folks!</div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="!allOrders.length && !pendingReq">No results found</div>
    </f7-list>

    <f7-popover id="pz-popover">
      <div class="popover-inner">
        <div class="list-block">
          <a @click="openPage('orderdetail')" class="list-button item-link close-popover">View Details {{status}}</a>
          <a @click="openPage('orderupdate')" class="list-button item-link close-popover" v-if="status=='105'">Update Order</a>
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
      status: '000'
    };
  },
  methods: {
    getAllOrders() {
      this.pendingReq = true;

      let url = `http://staging.prozo.com/api/v3/orders?orderBy=created_date&orderByValue=desc&limit=${this.limit}&offset=${this.offset}`;
      if (this.status && this.status !== '000') url += `&status=${this.status}`;
      window.vm.$http.get(url)
        .then(res => {

          this.allOrders = this.allOrders.concat(res.body);
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
      console.log('onInfiniteScroll');
      if (this.offset % this.limit === 0 && !this.pendingReq) this.getAllOrders();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openPage(pageName) {
      var id = window.Dom7('#pz-popover').data('pz-id');
      window.vm.$f7.mainView.router.load({
        url: pageName,
        context: { id: id }
      });
    },
    openPopover(id, e) {
      window.vm.$f7.popover(window.Dom7('#pz-popover'), e.target);
      window.Dom7('#pz-popover').data('pz-id', id);
    },
    statusChange() {
      console.log('this.status: ', this.status);
      this.allOrders = [];
      this.limit = 20;
      this.offset = 0;
      this.pendingReq = false;

      this.getAllOrders(this.status);
    },
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
  created: function() {
    console.log('All Orders created');
    this.getAllOrders();
  }
};
</script>
