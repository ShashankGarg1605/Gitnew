<template>
  <f7-page name="LandingPage">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center style="display: flex;align-items: center;">
        <span>LandingPage</span>
        <img style="height: 30px;padding-left: 30px;" :src="tenantImage" />
      </f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <section class="hero">
      <div>
        <button @click="openPage('dashboard')">Dashboard</button>
      </div>
    </section>
    <section class="links">
      <div class="left">
        <div><button @click="openPage('allorders')">ISBN Orders</button></div>
        <div><button @click="openPage('AllUsers')">Buyer Management</button></div>
        <div><button @click="openPage('CommunicationPanel')">Communications Panel</button></div>
      </div>
      <div class="right">
        <div><button @click="openPage('AllImageOrders')">Image Orders</button></div>
        <div><button @click="comingSoon()">Live Inventory</button></div>
        <div><button @click="openPage('PlaceServiceRequest')">Place Service Request</button></div>
      </div>      
    </section>
  </f7-page>
</template>

<style scoped>
.hero {
  background-image: url("../../../static/img/banner2.jpg");
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid lightgrey;
}
.links {
  background: white;
  height: 150px;
  display: flex;
  margin-top: 20px;
  justify-content: space-evenly;
}
.hero button {
  background: white;
  color: #009588;
  text-shadow: none;
  outline: none;
  padding: 15px;
  border-radius: 15px;
  margin: 10px;
  font-size: 1rem;
  border: none;
  width: 140px;
  transition: all 0.3s ease;
  box-shadow: 0px 2px 10px 0px #212121;
}

.links button {
  background: #009688;
  outline: none;
  /* padding: 15px; */
  border-radius: 15px;
  margin: 10px;
  font-size: 1rem;
  border: none;
  box-shadow: 0px 2px 1px 0px lightgrey;
  color: white;
  text-shadow: 0px 1px 1px black;
  width: 140px;
  transition: all 0.3s ease;
  height: 70px;
}
.hero button:active {
  box-shadow: none;
  background: #e0e0e0;
}
.links button:active {
  box-shadow: none;
  background: #006d63;
}
</style>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      title: "LandingPage Page",
      tenantImage: JSON.parse(window.localStorage.tenantData).logo_lnk
    };
  },
  methods: {
    openPage(page) {
      window.vm.$f7.mainView.router.loadPage(page);
    },
    comingSoon() {
      window.vm.$f7.addNotification({
        message: "This feature is coming soon!",
        hold: 2000
      });
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
