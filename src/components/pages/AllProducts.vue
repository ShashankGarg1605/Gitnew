<template>
  <f7-page name="AllProducts" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="icon-bars" open-panel="left"></f7-link>
      </f7-nav-left>
      <f7-nav-center>
        Products
      </f7-nav-center>
    </f7-navbar>

    <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">
      Found {{totalCount}} results
    </div>

    <div style="overflow: hidden; margin: 16px 16px 16px;">
      <a href="#" class="button button-fill button-raised pz-flex-c-c pz-float-r" @click="openFilters()">
        <icon name="filter"></icon>
        <span class="pz-padding-l16">Filter</span>
      </a>
    </div>

    <f7-list>
      <div v-if="allProducts.length" class="list-block">
        <ul>
          <li class="item-content" v-for="product in allProducts" :key="product.id" :class="{ 'pz-bg-red-lightest': product.status==0 }">
            <div class="item-inner" style="flex-direction: column;">
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Title:</div>
                <div class="col-70">{{product.title}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">ISBN:</div>
                <div class="col-70">{{product.isbn}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">Publisher:</div>
                <div class="col-70">{{product.publisher.name}}</div>
              </div>
              <div class="row pz-width100">
                <div class="col-30 color-gray pz-weight-thin">M.R.P:</div>
                <div class="col-70"> <span>Rs. {{product.mrp | moneyFormat}}</span></div>
              </div>
              <!--<i class="f7-icons pz-popover" @click='openPopover(user, $event)'>more_horiz</i>-->
            </div>
          </li>
        </ul>
      </div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="allProducts.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq">Thats all folks!</div>
      <div class="color-gray" style="text-align: center; font-style: italic;" v-if="!allProducts.length && !$pzGlobalReactiveData.pendingReq">No results found</div>
    </f7-list>

  </f7-page>
</template>

<script>
export default {
  name: 'AllProducts',
  data() {
    return {
      allProducts: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      filters: {
        search: [
          {
            placeholder: 'Title:'
          },
          {
            placeholder: 'Publisher:'
          },
          {
            placeholder: 'ISBN:'
          },
          {
            placeholder: 'M.R.P:'
          }
        ]
      }
    };
  },
  computed: {
    filterQuery() {
      let filterQuery = '';

      let { value: title = null } = this.filters.search[0];
      if (title !== null) filterQuery += `&name=${title}`;

      let { value: buyerMobile = null } = this.filters.search[1];
      if (buyerMobile !== null) filterQuery += `&mobile=${buyerMobile}`;

      let { value: isbn = null } = this.filters.search[2];
      if (isbn !== null) filterQuery += `&isbn=${isbn}`;

      return filterQuery;
    }
  },
  methods: {
    getAllProducts() {

      window.vm.$pzGlobalReactiveData.loaderOnAllReqs = false;
      const url = `${window._pz.apiEndPt}products?limit=${this.limit}&offset=${this.offset}` + this.filterQuery;
      window.vm.$http.get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];

          this.allProducts = this.allProducts.concat(res.body);
          this.offset += res.body.length;

          if (this.offset % this.limit !== 0) {
            this.removeInfiniteScroll();
          }
        })
        .catch((err) => {
          this.removeInfiniteScroll();
          window._pz.errFunc2.call(this, err);
        });
    },
    onInfiniteScroll() {
      if (this.offset % this.limit === 0 && !window.vm.$pzGlobalReactiveData.pendingReq) this.getAllProducts();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    openPage(pageName) {
      const id = this.clickedUser.id;
      const url = `${pageName}?id=${id}`;
      window.vm.$f7.mainView.router.load({
        url: url,
        context: { listFilters: this.filters } // send currently applied filters to the next page
      });
    },
    openPopover(user, e) {
      this.clickedUser = user;
      const popupID = '#' + this.randomID;
      window.vm.$f7.popover(window.Dom7(popupID), e.target);
    },
    // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
    addInfiniteScroll() {
      window.vm.$f7.attachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').show();
      this.hasReachedEnd = false;
    },
    removeInfiniteScroll() {
      window.vm.$f7.detachInfiniteScroll(window.Dom7('.infinite-scroll'));
      window.Dom7('.infinite-scroll-preloader').hide();
      this.hasReachedEnd = true;
    },
    openFilters() {
      window.vm.$f7.mainView.router.load({
        url: 'filters',
        // send over a clone of the filters object to avoid mutating it directly from the filters page
        context: { comps: JSON.parse(JSON.stringify(this.filters)) }
      });
    }
  },

  beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
  created() {
    console.debug(this.$options.name + ' created');

    if (window._pz.checkNested(this, '$route', 'options', 'context', 'comps')) this.filters = this.$route.options.context.comps;
    this.getAllProducts();
  },
  beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
  mounted() { console.debug(this.$options.name + ' mounted'); },
  beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
  updated() { console.debug(this.$options.name + ' updated'); },
  beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
  destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
