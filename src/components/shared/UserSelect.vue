<template>
  <div class="list-block pz-margin-top0">
    <a
      href="#"
      id="autocomplete-standalone-popup-2"
      class="item-link item-content autocomplete-opener"
      @click="openUserSelection()"
      :disabled="!users || !users.length"
    >
      <input type="hidden" v-model="userID">
      <div class="item-inner">
        <div class="item-title" v-if="!userID">Select User</div>
        <div class="item-title pz-max-width100 pz-width100" v-if="userID">{{this.selectedUser.name}}</div>
        <!-- <div class="item-after" :class="{'pz-max-width100': userID, 'pz-width100': userID}"></div> -->
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "UserSelect",
  data() {
    return {
      users: null,
      userID: null,
      selectedUser: null
    };
  },
  props: ["default"],
  watch: {
    userID() {
      this.$emit("update:value", this.userID);
    }
  },
  methods: {
    getAllUsers() {
      window.vm.$http
        .get(window._pz.apiEndPt + "users/list?type=2")
        .then(res => {
          console.log("res: ", res);
          if (res.ok) {
            this.users = res.body;
            this.setUserSelection();
            if (this.default) {
              const selectedUser = this.users.find(
                user => user.id === this.default
              );
              if (selectedUser) this.showSelectedValue(null, [selectedUser]);
            }
          }
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    setUserSelection() {
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
          const results = that.users.filter(
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
    openUserSelection() {
      if (!this.users) return this.getAllUsers();

      window.f7.params.hideNavbarOnPageScroll = false;
      this.autocompleteRef.open();
    },
    showSelectedValue(autocomplete, value) {
      this.userID = value[0].id;
      this.selectedUser = value[0];
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