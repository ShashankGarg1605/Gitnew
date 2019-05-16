<template>
  <f7-page
    name="Products"
    infinite-scroll
    @infinite="onInfiniteScroll"
    pull-to-refresh
    @ptr:refresh="onPullToRefresh"
  >
    <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
      <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>All Products</f7-nav-center>
    </f7-navbar>

    <div class="list-block">
      <ul>
        <li>
          <form @submit.prevent="onSearchClick()">
            <input
              type="text"
              class="search"
              v-model="keyword"
              placeholder="Search title, ISBN, publisher, author.."
              autofocus
            >
          </form>
        </li>
      </ul>
    </div>

    <f7-list>
      <div v-if="allProducts.length" class="list-block">
        <li v-if="p.mrp && p.title" class="item-content" v-for="p in allProducts" :key="p.objectID">
          <div class="left">
            <img v-if="p.image_url" :src="p.image_url">
            <img v-if="!p.image_url" src="../../assets/cover.jpg">
            <button
              v-if="$pzGlobalReactiveData.roleAccess('inventory', 'read') && p.stockPerWH === undefined"
              class="inStockBadge"
              @click="fetchStockData(p)"
            >Check Stock</button>
            <div class="inStockValue" v-if="p.stockPerWH">
              <div v-if="p.stockPerWH === 'zero'">Stock: 0</div>
              <div v-if="p.stockPerWH !== 'zero'">
                <div v-for="wh in p.stockPerWH" v-if="wh.warehouse" :key="wh.id">
                  <span>{{wh.warehouse.code}}:</span>
                  <span>{{wh.stock}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">{{p.title}}</div>
            <div class="info">
              <span class="key col-35">ISBN:</span>
              <span class="value col-65">{{p.isbn}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Publisher:</span>
              <span class="value col-65">{{p.publisher_name}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Language:</span>
              <span class="value col-65">{{p.language}}</span>
            </div>
            <div class="info">
              <span class="key col-35">MRP:</span>
              <span class="value col-65">{{p.mrp | moneyFormat}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Price:</span>
              <span class="value col-65">{{p.selling_price | moneyFormat}}</span>
            </div>
            <div class="info">
              <span class="key col-35">Discount:</span>
              <span class="value col-65">{{p.distributor_discount + '%'}}</span>
            </div>
          </div>
        </li>
      </div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="allProducts.length && hasReachedEnd && !working"
      >Thats all folks!</div>
      <div
        class="color-gray"
        style="text-align: center; font-style: italic;"
        v-if="!allProducts.length && !working"
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
import Algolia from "../../utils/algolia";

export default {
  name: "Products",
  data() {
    return {
      allProducts: [],
      totalCount: null,
      clickedOrder: null,
      keyword: "",
      page: 0,
      nbPages: null,
      working: null,
      discounts: null
    };
  },
  computed: {
    hasReachedEnd() {
      const hasReachedEnd = this.page >= this.nbPages;
      if (hasReachedEnd) this.removeInfiniteScroll();
      return hasReachedEnd;
    }
  },
  methods: {
    onInfiniteScroll() {
      const isWorking =
        window.vm.$pzGlobalReactiveData.pendingReq || this.working;
      if (!isWorking) this.fetch();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: "filters",
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    },
    fetch() {
      this.working = true;
      this.algolia
        .fetch(this.keyword, this.page)
        .then(this.onFetchSuccess)
        .catch(this.onFetchFail);
    },
    onFetchSuccess(res) {
      this.working = false;

      this.allProducts = this.allProducts.concat(this.processData(res.hits));
      if (!this.allProducts.length) this.removeInfiniteScroll();

      this.page = res.page + 1;
      this.nbPages = res.nbPages;
    },
    onFetchFail() {
      this.working = false;
    },
    processData(data) {
      data.forEach(item => {
        const discountObject =
          this.discounts &&
          this.discounts.find(
            d =>
              d.publisherCategory && d.publisherCategory.id === item.category_id
          );
        if (discountObject) item.distributor_discount = discountObject.discount;

        const mrp = parseFloat(item.mrp);
        const discount = parseFloat(item.distributor_discount);

        item.selling_price = mrp - (mrp * discount) / 100;

        item.image_url = item.image_name
          ? "http://imgbiz.prozo.com/260x405/" + item.image_name
          : null;
      });
      return data;
    },
    fetchDiscounts(cb) {
      const url = `${window._pz.apiEndPt}users/discounts/${
        window.vm.$pzGlobalReactiveData.userID
      }`;
      window.vm.$http
        .get(url)
        .then(res => {
          this.discounts = res.data;
          cb();
        })
        .catch(err => {
          console.log("err: ", err);
          cb();
        });
    },
    reset() {
      this.allProducts = [];
      this.totalCount = null;
      this.clickedOrder = null;
      this.keyword = "";
      this.page = 0;
      this.nbPages = null;
      this.working = null;
      this.discounts = null;
    },
    onSearchClick() {
      const keyword = this.keyword;
      this.reset();
      this.keyword = keyword;

      this.fetch();
      this.addInfiniteScroll();
    },
    fetchStockData(clickedObj) {
      const id = clickedObj.objectID;
      if (!id) return;

      const url = `${window._pz.apiEndPt}inventory?product=${id}`;
      window.vm.$http
        .get(url)
        .then(res => {
          if (!res.ok || res.status !== 200 || !res.data || !res.data.length)
            clickedObj.stockPerWH = "zero";
          else {
            clickedObj.stockPerWH = res.data;
            clickedObj.instock = res.data.some(wh => wh.stock > 0);
          }

          const idx = this.allProducts.findIndex(
            p => p.objectID === clickedObj.objectID
          );
          if (idx !== undefined)
            window.vm.$set(this.allProducts, idx, clickedObj);
        })
        .catch(err => {
          console.log("err: ", err);
          clickedObj.stockPerWH = "zero";
          const idx = this.allProducts.findIndex(
            p => p.objectID === clickedObj.objectID
          );
          if (idx !== undefined)
            window.vm.$set(this.allProducts, idx, clickedObj);
        });
    },
    removeInfiniteScroll() {
      console.log("removeInfiniteScroll: ");
      window.vm.$f7.detachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").hide();
    },

    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7(".infinite-scroll"));
      window.Dom7(".infinite-scroll-preloader").show();
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.fetchDiscounts(() => {
      this.algolia = new Algolia();
      this.fetch();
    });
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
