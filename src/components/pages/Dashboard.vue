<template>
  <f7-page name="Dashboard">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center style="display: flex;align-items: center;">
        <span>Dashboard</span>
        <img style="height: 30px;padding-left: 30px;" :src="tenantImage" />
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>Welcome {{$pzGlobalReactiveData.userName}}</f7-block-title>
    <f7-block inner>
      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>No. of open orders</span>
                <span class="value">{{nbOpenOrders}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Total value of inventory</span>
                <span class="value">{{totalInventoryValue | moneyFormat}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Total value of receivables</span>
                <span class="value">{{totalReceivables | moneyFormat}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner" style="display: flex; justify-content: space-between; flex-direction: column;">
                <div>No. of accounts:</div>
                <div style="display: flex; justify-content: space-between;"><span>Active</span>
                <span class="value">{{nbActiveUsers}}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Inactive</span>
                <span class="value">{{nbInactiveUsers}}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Total</span>
                <span class="value">{{nbTotalUsers}}</span></div>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>No. of open returns</span>
                <span class="value">{{nbOpenReturns}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Value of open returns</span>
                <span class="value">{{openReturnsValue | moneyFormat}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>No. of un-converted image orders</span>
                <span class="value">{{nbImageOrdersNotConv}}</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Buyer conversations in last week</span>
                <span class="value">{{nbBuyerConvosToday}}</span></div>
              </div>
          </div>
      </div>

    </f7-block>
  </f7-page>
</template>

<style scoped>
.value {
    font-weight: bold;
    color: #419688;
    flex: 1 0 auto;
    text-align: right;
    padding-left: 15px;
}
</style>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      title: "Dashboard Page",
      tenantImage: JSON.parse(window.localStorage.tenantData).logo_lnk,
      nbOpenOrders: null,
      totalInventoryValue: null,
      totalReceivables: null,
      nbOpenReturns: null,
      openReturnsValue: null,
      nbImageOrdersNotConv: null,
      nbBuyerConvosToday: null,
      nbBuyerConvosYest: null,
      nbActiveUsers: null,
      nbInactiveUsers: null,
      nbTotalUsers: null
    };
  },
  methods: {
    loadAllData() {
      this.getNbOpenOrders();
      this.getTotalInventoryValue();
      this.getTotalReceivables();
      this.getOpenReturns();
      this.getNbImageOrdersNotConv();
      this.getNbBuyerConvosToday();
      this.getNbUsers();
    },
    getNbOpenOrders() {
      window.vm.$http.get(window._pz.apiEndPt + 'orders?status=113')
        .then(res => {
            if (res.ok && window._pz.checkNested(res, 'headers', 'map', 'count')) this.nbOpenOrders = res.headers.map.count[0];
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getTotalInventoryValue() {
      window.vm.$http.get(window._pz.apiEndPt + 'dashboard/inventory')
        .then(res => {
          if (res.ok && res.body.inventoryValue !== undefined) this.totalInventoryValue = res.body.inventoryValue;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getTotalReceivables() {
        window.vm.$http.get(window._pz.apiEndPt + 'dashboard/collections')
        .then(res => {
          if (res.ok && res.body.collectionDue !== undefined) this.totalReceivables = res.body.collectionDue;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getOpenReturns() {
      window.vm.$http.get(window._pz.apiEndPt + 'dashboard/returns')
        .then(res => {
          if (res.ok && res.body.openReturns !== undefined){
            this.nbOpenReturns = res.body.openReturns;
            this.openReturnsValue = res.body.openReturnsValue;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getNbImageOrdersNotConv() {
      window.vm.$http.get(window._pz.apiEndPt + 'orders/image?view=daily')
        .then(res => {
          if (res.ok) this.nbImageOrdersNotConv = res.body.length;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getNbBuyerConvosToday() {
      const endDate = window.vm.moment().format('YYYY-MM-DD');
      const startDate = window.vm.moment().subtract(7, 'd').format('YYYY-MM-DD');
      window.vm.$http.get(`${window._pz.apiEndPt}communication/hours?startDate=${startDate}&endDate=${endDate}`)
        .then(res => {
          if (res.ok) this.nbBuyerConvosToday = res.body.length;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    getNbUsers() {
      window.vm.$http.get(window._pz.apiEndPt + 'dashboard/users')
        .then(res => {
          if (res.ok){
            this.nbActiveUsers = res.body.totalActiveCount;
            this.nbInactiveUsers = res.body.totalInactiveCount;
            this.nbTotalUsers = res.body.totalUserCount;
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    }
  },
  beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
  created() {
    console.debug(this.$options.name + ' created'); 
    this.loadAllData();
  },
  beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
  mounted() { console.debug(this.$options.name + ' mounted'); },
  beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
  updated() { console.debug(this.$options.name + ' updated'); },
  beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
  destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
