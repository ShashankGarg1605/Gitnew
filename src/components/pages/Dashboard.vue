<template>
  <f7-page name="Dashboard">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Dashboard
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <f7-block-title>Welcome {{$pzGlobalReactiveData.userID}}</f7-block-title>
    <f7-block inner>
      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Open Order</span>
                <span class="value">222</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Total inventory value</span>
                <span class="value">Rs. 45,422</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>total receivables</span>
                <span class="value">Rs. 15,422</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>New accounts added in last 30 days</span>
                <span class="value">422</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>open returns</span>
                <span class="value">12</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner pz-flex-j-sb">
                <span>Image orders not converted</span>
                <span class="value">22</span>
              </div>
          </div>
      </div>

      <div class="card">
          <div class="card-content">
              <div class="card-content-inner" style="display: flex; justify-content: space-between; flex-direction: column;">
                <div>Buyer conversations</div>
                <div style="display: flex; justify-content: space-between;"><span>Today</span>
                <span class="value">22</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Today</span>
                <span class="value">22</span></div>
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
}
</style>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      title: "Dashboard Page"
    };
  },
  beforeCreate: function() {
    console.log("Dashboard before create");
  },
  created: function() {
    console.log("Dashboard created");
  },
  beforeMount: function() {
    console.log("Dashboard before mounted");
  },
  mounted: function() {
    console.log("Dashboard mounted");
  },
  beforeUpdate: function() {
    console.log("Dashboard befor updated");
  },
  updated: function() {
    console.log("Dashboard updated");
  },
  beforeDestroy: function() {
    console.log("Dashboard before destroyed");
  },
  destroyed: function() {
    console.log("Dashboard destroyed");
  }
};
</script>
