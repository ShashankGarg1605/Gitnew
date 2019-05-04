<template>
  <li class="item-content button pz-colr-inherit pz-cap">
    <div class="item-media">
      <icon name="pencil"></icon>
    </div>
    <div class="item-inner pz-margin-l0">
      <span class="pz-size-normal">{{placeholder}}</span>
      <input type="text" placeholder="enter here" v-model="compvalue">

      <div class="item-after" @click="compvalue = null">
        <span>
          <icon name="close"></icon>
        </span>
      </div>
    </div>
  </li>
</template>

<style scoped>
input {
  margin-left: 10px !important;
  border-bottom: 1px dashed lightgrey !important;
  color: grey !important;
  font-weight: lighter !important;
}
</style>

<script>
export default {
  name: "FilterSearch",
  data() {
    return {
      compvalue: this.value
    };
  },
  props: ["placeholder", "value"],
  watch: {
    compvalue() {
      this.$emit("update:value", this.compvalue);
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
