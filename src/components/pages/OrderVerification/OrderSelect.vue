<template>
    <f7-page name="OrderSelect">
        <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
            <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center style="display: flex;align-items: center;">
                <span>OrderSelect</span>
            </f7-nav-center>
        </f7-navbar>
        <!-- Scrollable page content-->
        <main>OrderSelect</main>
    </f7-page>
</template>

<style scoped>
</style>

<script>
export default {
  name: "OrderSelect",
  data() {
    return {
      title: "OrderSelect",
      orderId: null,
      orders: null
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
