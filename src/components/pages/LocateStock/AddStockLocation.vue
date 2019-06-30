<template>
  <f7-page name="AddStockLocation">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Add Stock Location</f7-nav-center>
    </f7-navbar>

    <div class="add-section">
      <div class="cta pz-flex-c-c pz-margin-tb16">
        <button
          type="button"
          @click="scanBook()"
          class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
        >Scan book</button>
        <button
          type="button"
          @click="searchBook()"
          class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
        >Search book</button>
      </div>

      <div class="list-block">
        <ul>
          <li class="product" v-if="scannedItem">
            <div class="left">
              <img v-if="scannedItem.image_name" :src="scannedItem.image_name">
              <img v-if="!scannedItem.image_name" src="../../../assets/cover.jpg">
            </div>
            <div class="right">
              <div class="title">{{scannedItem.title}}</div>
              <div class="info">
                <span class="key col-35">ISBN:</span>
                <span class="value col-65">{{scannedItem.isbn}}</span>
              </div>
              <div class="info">
                <span class="key col-35">Author:</span>
                <span class="value col-65">{{scannedItem.author}}</span>
              </div>
              <div class="info">
                <span class="key col-35">MRP:</span>
                <span class="value col-65">{{scannedItem.mrp}}</span>
              </div>
              <div class="info">
                <span class="key col-35">Publisher:</span>
                <span class="value col-65">{{scannedItem.publisher.name}}</span>
              </div>
            </div>
          </li>
          <div class="form" v-if="allWH && scannedItem">
            <single-select
              v-if="!$pzGlobalReactiveData.warehouse || !$pzGlobalReactiveData.warehouse.id"
              :value.sync="selectedWH"
              placeholder="Select warehouse *"
              :opts="allWH"
            />
            <li
              class="item-content pz-colr-inherit pz-cap"
              @click="scanLocationCode()"
              v-if="selectedWH || ($pzGlobalReactiveData.warehouse && $pzGlobalReactiveData.warehouse.id)"
            >
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Scan location *</span>
                <input
                  type="text"
                  :value="scannedLocationCode && scannedLocationCode.code"
                  disabled
                  placeholder="Click here to open scanner"
                >
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Put away stock *</span>
                <input type="number" placeholder="Enter a number" v-model="enteredQty">
              </div>
            </li>
          </div>
        </ul>
        <div class="item-content pz-cap pz-colr-inherit pz-flex-c-e">
          <button
            type="button"
            @click="addStock()"
            class="button button-raised"
            v-if="isFormValid"
          >Confirm</button>
        </div>
      </div>
    </div>

    <div class="color-gray pz-page-err" v-if="!$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>
  </f7-page>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li.product {
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
</style>

<script>
import FilterSingleSelect from "../../FilterSingleSelect";
export default {
  name: "AddStockLocation",
  components: {
    "single-select": FilterSingleSelect
  },
  data() {
    return {
      errMsg: null,
      scannedItem: null,
      enteredQty: null,
      scannedLocationCode: null,
      selectedWH: null,
      allWH: null
    };
  },
  computed: {
    isFormValid() {
      const adminWH = window.vm.$pzGlobalReactiveData.warehouse;
      console.log("adminWH: ", adminWH);
      const isWhNonZero = adminWH && adminWH.id !== 0;
      console.log("isWhNonZero: ", isWhNonZero);
      let isValid;
      if (isWhNonZero) isValid = this.enteredQty && this.scannedLocationCode;
      else
        isValid =
          this.enteredQty && this.scannedLocationCode && this.selectedWH;
      console.log("isValid: ", isValid);
      return isValid;
    }
  },
  methods: {
    resetData() {
      this.scannedItem = null;
      this.enteredQty = null;
      this.scannedLocationCode = null;
      this.selectedWH = null;
    },
    searchBook() {
      this.resetData();

      window.vm.$f7.mainView.router.load({
        url: "book-selector"
      });
    },
    onBookSelected(event) {
      console.log("event.detail.selectedBook: ", event.detail.selectedBook);
      const book = event.detail.selectedBook;
      const isbn = book.isbn;
      this.fetchBookDetails(isbn);
    },
    scanBook() {
      this.resetData();

      window.vm.$pzGlobalReactiveData
        .scanCode()
        .then(res => {
          const scannedProductIsbn = res.text;
          if (scannedProductIsbn) {
            this.fetchBookDetails(scannedProductIsbn);
          } else
            window.vm.$f7.addNotification({
              message: "Could not scan the code",
              hold: 2000
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchBookDetails(isbn) {
      window.vm.$http
        .get(`${window._pz.apiEndPt}products?isbn=${isbn}`)
        .then(res => {
          if (!res.ok || !res.body.length)
            return window.vm.$f7.addNotification({
              message: "No product found with ISBN " + isbn,
              hold: 2000
            });

          this.scannedItem = res.body[0];
          this.scannedItem.image_name = this.scannedItem.image_name
            ? window._pz.imageEndPt + this.scannedItem.image_name
            : null;
        })
        .catch(err => {
          console.log("err: ", err);
          return window.vm.$f7.addNotification({
            message: "No product found with ISBN " + isbn,
            hold: 2000
          });
        });
    },
    getWH() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}inventory/warehouses`)
        .then(res => {
          if (!res.ok) return window._pz.errFunc2.call(this);
          const allWH = res.body
            .map(wh => ({
              label: wh.code,
              value: wh.id
            }))
            .filter(wh => wh.label !== "All");

          this.allWH = allWH;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    scanLocationCode() {
      this.scannedLocationCode = null;
      window.vm.$pzGlobalReactiveData
        .scanCode()
        .then(res => {
          console.log("res: ", res);
          const adminWH =
            this.selectedWH || window.vm.$pzGlobalReactiveData.warehouse.id;

          window.vm.$http
            .get(
              `${
                window._pz.apiEndPt
              }inventory/warehouses/locations?warehouse=${adminWH}&code=${
                res.text
              }`
            )
            .then(res => {
              console.log("res: ", res);
              if (!res.ok || !res.body || !res.body.length)
                return window.vm.$f7.addNotification({
                  message: "Location code not found",
                  hold: 2000
                });
              this.scannedLocationCode = res.body[0];
            })
            .catch(window._pz.errFunc2.bind(this));
        })
        .catch(err => {
          console.log(err);
        });
    },
    addStock() {
      const params = {
        product: { id: this.scannedItem.id },
        location: { id: this.scannedLocationCode.id },
        quantity: this.enteredQty
      };
      console.log("params: ", params);
      window.vm.$http
        .post(
          `${window._pz.apiEndPt}inventory/warehouses/location_details`,
          params
        )
        .then(res => {
          console.log("res: ", res);
          if (!res.ok) window._pz.errFunc2.call(this);
          else {
            window.vm.$f7.addNotification({
              message: "Added successfully!",
              hold: 2000
            });
            window._pz.refreshOnBack = true;
            window.vm.$f7.mainView.router.back();
          }
        })
        .catch(err => {
          console.log("err: ", err);
          if (err.status === 409)
            return window.vm.$f7.addNotification({
              message: `${err.body.message} (subCode: ${err.body.subCode})`,
              hold: 2000
            });
          else window._pz.errFunc2.call(this);
        });
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.getWH();

    document.addEventListener("bookSelected", this.onBookSelected, false);
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
    document.removeEventListener("bookSelected", this.onBookSelected, false);
  },
  destroyed() {
    console.debug(this.$options.name + " destroyed");
  }
};
</script>
