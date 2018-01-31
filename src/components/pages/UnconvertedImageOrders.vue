<template>
    <f7-page name="UnconvertedImageOrders" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

        <f7-navbar>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Un-converted Image Orders
            </f7-nav-center>
        </f7-navbar>

        <f7-fab color="pink" href="/PlaceImageOrder">
            <f7-icon icon="icon-plus"></f7-icon>
        </f7-fab>

        <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">
            Found {{totalCount}} results
        </div>

        <f7-list>
            <div v-if="allOrders.length" class="list-block">
                <ul>
                    <li class="item-content" v-for="order in allOrders" :key="order.id">
                        <div class="item-inner" style="flex-direction: column;">
                            <div class="row pz-width100">
                                <div class="col-30 color-gray pz-weight-thin">Order ID:</div>
                                <div class="col-70">{{order.order_id}}</div>
                            </div>
                            <div class="row pz-width100">
                                <div class="col-30 color-gray pz-weight-thin">Buyer:</div>
                                <div class="col-70">{{order.user.buyer_name}}</div>
                            </div>
                            <div class="row pz-width100">
                                <div class="col-30 color-gray pz-weight-thin">Created:</div>
                                <div class="col-70">{{order.created_date | dateFormat}}</div>
                            </div>
                            <div v-if="order.img_path && order.img_path.length" style="width:100%;">
                                <span v-for="(image, index) in order.img_path.split(';')" :key="index" 
                                @click="openPhotoBrowser(order.img_path, order.img_title, index)" 
                                class="button pz-bg-gray-lightest image pz-flex-sa-c pz-margin-r16" 
                                style="float: left; margin-bottom: 10px;">
                                    <icon name="image"></icon>#{{index+1}}
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="color-gray" style="text-align: center; font-style: italic;" v-if="allOrders.length && hasReachedEnd && !$pzGlobalReactiveData.pendingReq">Thats all folks!</div>
            <div class="color-gray" style="text-align: center; font-style: italic;" v-if="!allOrders.length && !$pzGlobalReactiveData.pendingReq">No results found</div>
        </f7-list>
    </f7-page>
</template>

<script>
export default {
  name: "UnconvertedImageOrders",
  data() {
    return {
      allOrders: [],
      limit: 20,
      offset: 0,
      hasReachedEnd: false,
      totalCount: null,
      uploadsEndPt: window._pz.uploadsEndPt + "imageorders/"
    };
  },
  methods: {
    getAllOrders() {
      let url = `${window._pz.apiEndPt}orders/image?view=daily`;
      window.vm.$http
        .get(url)
        .then(res => {
          this.totalCount = res.headers.map.count && res.headers.map.count[0];

          this.allOrders = this.allOrders.concat(res.body);
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
    onInfiniteScroll() {
      if (this.offset % this.limit === 0 && !window.vm.$pzGlobalReactiveData.pendingReq) this.getAllOrders();
    },
    onPullToRefresh() {
      window.vm.$f7.mainView.router.refreshPage();
    },
    // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
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
    openPhotoBrowser(images, imageTitles, index) {
      if (!images || images.length < 1) return;
      images = images.split(";");
      imageTitles = (imageTitles && imageTitles.length && imageTitles.split(";")) || [];
      var o = images.map((image, idx) => ({
        url: this.uploadsEndPt + image,
        caption: imageTitles[idx]
      }));
      var a = window.vm.$f7.photoBrowser({
        type: "popup",
        theme: "dark",
        toolbar: images.length > 1,
        initialSlide: index,
        photos: o
      });
      a.open();
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.getAllOrders();
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
