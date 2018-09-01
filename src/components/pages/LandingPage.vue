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
        <button>Dashboard</button>
      </div>
    </section>
    <section class="links">
      <div class="left">
        <div><button>ISBN Orders</button></div>
        <div><button>Buyers</button></div>
        <div><button>Communication Panel</button></div>
      </div>
      <div class="right">
        <div><button>Image Orders</button></div>
        <div><button>Inventory</button></div>
        <div><button>Place Service Request</button></div>
      </div>      
    </section>
  </f7-page>
</template>

<style scoped>
.hero {
      /* background: beige; */
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
.hero button, .links button {
      background: #009688;
    outline: none;
    padding: 15px;
    border-radius: 15px;
    margin: 10px;
    font-size: 1rem;
    border: none;
    box-shadow: 0px 2px 1px 0px lightgrey;
    color: white;
    text-shadow: 0px 1px 1px black;
    width: 140px;
    transition: all 0.3s ease;
}
.hero button:active, .links button:active {
  box-shadow: none;
    background: #006d63;
}
</style>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      title: "LandingPage Page"
    };
  },
  methods: {},
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
