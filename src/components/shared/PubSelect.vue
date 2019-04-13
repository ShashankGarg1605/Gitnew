<template>
  <div class="list-block pz-margin-top0">
    <a
      href="#"
      id="autocomplete-standalone-popup-2"
      class="item-link item-content autocomplete-opener"
      @click="openPubSelection()"
      :disabled="!pubs || !pubs.length"
    >
      <input type="hidden" v-model="pubID">
      <div class="item-inner">
        <div class="item-title" v-if="!pubID">Select Publisher</div>
        <div class="item-title pz-max-width100 pz-width100" v-if="pubID">{{this.selectedPub.name}}</div>
        <!-- <div class="item-after" :class="{'pz-max-width100': pubID, 'pz-width100': pubID}"></div> -->
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "PubSelect",
  data() {
    return {
      pubs: null,
      pubID: null,
      selectedPub: null
    };
  },
  props: ["default"],
  watch: {
    pubID() {
      this.$emit("update:selectedPub", this.selectedPub);
    }
  },
  methods: {
    getAllUsers() {
      window.vm.$http
        .get(window._pz.apiEndPt + "publishers")
        .then(res => {
          console.log("res: ", res);
          if (res.ok) {
            this.pubs = res.body;
            this.setPubSelection();
            if (this.default) {
              const selectedPub = this.pubs.find(
                user => user.id === this.default
              );
              if (selectedPub) this.showSelectedValue(null, [selectedPub]);
            }
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    setPubSelection() {
      let that = this; // save a ref to this to use inside callbacks
      this.autocompleteRef = window.vm.$f7.autocomplete({
        openIn: "popup", //open in popup
        opener: window.vm.Dom7("#autocomplete-standalone-popup-2"), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        textProperty: "name",
        autoFocus: true,
        valueProperty: "id",
        source(autocomplete, query, render) {
          if (!query || !query.length || query.length < 3) return;

          query = query.toLowerCase();
          const results = that.pubs.filter(
            user => user.name.toLowerCase().indexOf(query) !== -1
          );
          render(results);
        },
        onChange: this.showSelectedValue.bind(that),
        onClose() {
          window.f7.params.hideNavbarOnPageScroll = true;
        }
      });
    },
    openPubSelection() {
      if (!this.pubs) return this.getAllUsers();

      window.f7.params.hideNavbarOnPageScroll = false;
      this.autocompleteRef.open();
    },
    showSelectedValue(autocomplete, value) {
      this.pubID = value[0].id;
      this.selectedPub = value[0];
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.getAllUsers();
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