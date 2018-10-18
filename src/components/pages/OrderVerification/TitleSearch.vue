<template>
  <f7-page name="Title Search">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Search for a book</f7-nav-center>
    </f7-navbar>
    <!-- Scrollable page content-->
    <main>
      <f7-list>
        <div class="list-block">
          <ul>
            <li>
              <div class="item-content">
                <div class="item-media">
                  <i class="icon f7-icons">search</i>
                </div>
                <div class="item-inner">
                  <div class="item-input">
                    <input
                      type="text"
                      v-model="keyword"
                      placeholder="Title, ISBN, publisher or code"
                    >
                  </div>
                </div>
                <div v-if="keyword" class="item-media" @click="keyword=null">
                  <i class="icon f7-icons">close</i>
                </div>
              </div>
            </li>
            <li
              class="item-content"
              v-for="title in searchResults"
              :key="title.id"
              @click="selectBook(title)"
            >
              <div class="item-inner">
                <div class="row pz-width100">
                  <div>{{title.product.title}}</div>
                  <div class="money">(MRP: {{title.product.mrp | moneyFormat}})</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </f7-list>
    </main>
  </f7-page>
</template>

<style scoped>
/* input {
  background: aliceblue;
  width: 100%;
  border: none;
  padding: 1rem;
  font-size: 1rem;
} */
.item-content {
  border-bottom: 1px solid #eeeeee;
}
</style>

<script>
export default {
  name: "TitleSearch",
  data() {
    return {
      title: "TitleSearch",
      keyword: null,
      products: null,
      orderId: null
    };
  },
  
  computed: {
    searchableProducts() {
      return this.products.filter(p => !p.product.is_added_by_user && p.verified_quantity < p.quantity);
    },
    searchResults() {
      if (!this.keyword || !this.keyword.length || this.keyword.length < 3) return null;
      const k = this.keyword.toLowerCase();
      return this.searchableProducts.filter(p => p.product.title.toLowerCase().includes(k) || p.product.isbn.toLowerCase().includes(k) || p.product.publisher.name.toLowerCase().includes(k));
    }
  },
  methods: {
    selectBook(title) {
      window.vm.$f7.mainView.router.load({
        url: "VerifyProduct",
        reload: true,
        context: {
          bookData: title,
          orderId: this.orderId
        }
      });
    }
  },
  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    if (window._pz.checkNested(this, "$route", "options", "context", "products"))
      this.products = this.$route.options.context.products;

    if (window._pz.checkNested(this, "$route", "options", "context", "orderId"))
      this.orderId = this.$route.options.context.orderId;
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
