<template>
  <f7-page
    name="LocateStock"
    infinite-scroll
    @infinite="onInfiniteScroll"
    pull-to-refresh
    @ptr:refresh="onPullToRefresh"
  >
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>Locate Stock</f7-nav-center>
    </f7-navbar>
    <f7-fab
      color="pink"
      href="/AddStockLocation"
      v-if="$pzGlobalReactiveData.roleAccess('whlocation', 'create')"
    >
      <f7-icon icon="icon-plus"></f7-icon>
    </f7-fab>

    <div style="overflow: hidden; margin: 16px 16px 16px;">
      <a
        href="#"
        class="button button-fill button-raised pz-flex-c-c pz-float-r"
        @click="openFilters()"
      >
        <icon name="filter"></icon>
        <span class="pz-padding-l16">Filter</span>
      </a>
    </div>
    <f7-list>
      <div v-if="allProducts.length" class="list-block">
        <li class="item-content" v-for="p in allProducts" :key="p.id">
          <div class="left">
            <img v-if="p.product.image_name" :src="p.product.image_name">
            <img v-if="!p.product.image_name" src="../../../assets/cover.jpg">
          </div>
          <div class="right">
            <div class="title">{{p.product.title}}</div>
            <div class="info">
              <span class="key col-35">ISBN:</span>
              <span class="value col-65">{{p.product.isbn}}</span>
            </div>
            <div class="info">
              <span class="key col-35">MRP:</span>
              <span class="value col-65">{{p.product.mrp}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Author:</span>
              <span class="value col-65">{{p.product.author}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Location:</span>
              <span class="value col-65">{{`${p.location.code} (${p.location.warehouse.code})`}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Quantity:</span>
              <span class="value col-65">{{p.quantity }}</span>
            </div>
          </div>
        </li>
      </div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="allProducts.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq"
      >Thats all folks!</div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="!allProducts.length && !$pzGlobalReactiveData.pendingReq"
      >No results found</div>
    </f7-list>
  </f7-page>
</template>

<style scoped>
li {
  border-bottom: 1px solid #dddddd;
  margin: 0;
  font-size: 14px;
  display: flex !important;
  align-items: end !important;
  padding: 10px;
}

.left {
  max-width: 30%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30%;
}

.right {
  max-width: 70%;
  flex-grow: 1;
}

li img {
  width: 100% !important;
}

div.title {
  font-weight: bold;
  line-height: normal;
  color: #424242;
  margin-bottom: 5px;
}

div.info {
  display: flex;
}

span.key {
  color: #9e9e9e;
  min-width: 80px;
}
span.value {
  color: #616161;
}

.inStockBadge {
  border: 1px solid green;
  border-radius: 20px;
  font-size: x-small;
  padding: 7px 9px;
  color: green;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 5px;
  background: white;
}

.inStockValue {
  text-align: center;
  font-size: smaller;
  color: green;
  font-weight: bold;
}

.list-block {
  margin: 0;
}

form {
  width: 100%;
}
</style>

<script>
export default {
  name: "LocateStock",
  data() {
    return {
      allProducts: [],
      clickedOrder: null,
      keyword: "",
      hasReachedEnd: false,
      limit: 20,
      offset: 0,

      filters: {
        search: [
          {
            placeholder: "Title"
          },
          {
            placeholder: "Location"
          }
        ]
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = "";

      let { value: title = null } = this.filters.search[0];
      if (title !== null) filterQuery += `&title=${title}`;

      let { value: location = null } = this.filters.search[1];
      if (location !== null) filterQuery += `&code=${location}`;

      return filterQuery;
    }
  },
  methods: {
    onInfiniteScroll() {
      if (
        this.offset % this.limit === 0 &&
        !window.vm.$pzGlobalReactiveData.pendingReq
      )
        this.fetchAllProducts();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    fetchAllProducts() {
      let url = `${
        window._pz.apiEndPt
      }inventory/warehouses/location_details?limit=${this.limit}&offset=${
        this.offset
      }`;

      const adminWH = window.vm.$pzGlobalReactiveData.warehouse;
      if (adminWH && adminWH.id) url += `&warehouse=${adminWH.id}`;

      url += this.filterQuery;

      window.vm.$http
        .get(url)
        .then(res => {
          if (!res.ok || !res.body || !res.body.length)
            window._pz.errFunc2.bind(this);

          res.body.forEach(book => {
            book.product.image_name = book.product.image_name
              ? window._pz.imageEndPt + book.product.image_name
              : null;
          });

          this.allProducts = this.allProducts.concat(res.body);

          this.offset += res.body.length;

          if (this.offset % this.limit !== 0) {
            this.removeInfiniteScroll();
          }
        })
        .catch(err => {
          this.removeInfiniteScroll();
          window._pz.errFunc2.call(this, err);
        });
    },
    onSearchClick() {
      const keyword = this.keyword;
      this.reset();
      this.keyword = keyword;

      this.fetch();
      this.addInfiniteScroll();
    },
    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").show();
      this.hasReachedEnd = false;
    },
    removeInfiniteScroll() {
      window.vm.$f7.detachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").hide();
      this.hasReachedEnd = true;
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: "filters",
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    if (window._pz.checkNested(this, "$route", "options", "context", "comps"))
      this.filters = this.$route.options.context.comps;
    this.fetchAllProducts();
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
