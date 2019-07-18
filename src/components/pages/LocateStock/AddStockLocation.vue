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
              <img v-if="scannedItem.image_name" :src="scannedItem.image_name" />
              <img v-if="!scannedItem.image_name" src="../../../assets/cover.jpg" />
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
          <div class="form" v-if="scannedItem">
            <single-select
              v-if="!isWhAssigned && allWH"
              :value.sync="selectedWH"
              placeholder="Select warehouse *"
              :opts="allWH"
            />
            <li
              class="item-content pz-colr-inherit pz-cap"
              v-show="selectedWH && allLocationsForWh"
            >
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Select location *</span>
                <span class="selected-location">{{scannedLocationCode && scannedLocationCode.code}}</span>
                <div class="btns-container">
                  <button @click="scanLocationCode()" class="button button-fill">Scan</button>
                  <input
                    type="text"
                    placeholder="Search"
                    class="autocomplete-trigger button button-fill"
                    id="autocomplete-dropdown"
                    @click="setAutocomplete()"
                  />
                </div>
              </div>
            </li>
            <li class="item-content pz-colr-inherit pz-cap" v-if="scannedLocationCode">
              <div class="item-media">
                <icon name="pencil"></icon>
              </div>
              <div class="item-inner pz-margin-l0 input-field">
                <span class="pz-size-normal">Put away stock *</span>
                <input type="number" placeholder="Enter a number" v-model="enteredQty" />
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

.tool-tip {
  text-align: center;
  display: block;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 11px;
  color: #009588;
}

.btns-container {
  width: inherit;
  display: flex;
  justify-content: space-evenly;
}
.autocomplete-trigger {
  width: 100px !important;
}
.autocomplete-trigger::placeholder {
  color: white !important;
}

.selected-location {
  color: #419688 !important;
  font-size: x-small !important;
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
      scannedItem: null,
      enteredQty: null,
      scannedLocationCode: null,
      selectedWH: null,
      allWH: null,
      allLocationsForWh: null,
      autoCompleteRef: null,
      isWhAssigned: null
    };
  },
  watch: {
    selectedWH: function() {
      this.scannedLocationCode = null;
      this.fetchAllLocationsForWH();
    }
  },
  computed: {
    isFormValid() {
      const adminWH = window.vm.$pzGlobalReactiveData.warehouse;
      const isWhNonZero = adminWH && adminWH.id !== 0;
      let isValid;
      if (isWhNonZero) isValid = this.enteredQty && this.scannedLocationCode;
      else
        isValid =
          this.enteredQty && this.scannedLocationCode && this.selectedWH;
      return isValid;
    }
  },
  methods: {
    resetData() {
      this.scannedItem = null;
      this.enteredQty = null;
      this.scannedLocationCode = null;

      if (this.isWhAssigned) {
        this.selectedWH = window.vm.$pzGlobalReactiveData.warehouse.id;
        this.fetchAllLocationsForWH();
      } else this.selectedWH = null;
    },
    searchBook() {
      this.resetData();

      window.vm.$f7.mainView.router.load({
        url: "book-selector"
      });
    },
    onBookSelected(event) {
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
          window.vm.$http
            .get(
              `${window._pz.apiEndPt}inventory/warehouses/locations?warehouse=${this.selectedWH}&code=${res.text}`
            )
            .then(res => {
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
    fetchAllLocationsForWH() {
      this.allLocationsForWh = null;
      this.scannedLocationCode = null;

      window.vm.$http
        .get(
          `${window._pz.apiEndPt}inventory/warehouses/locations?warehouse=${this.selectedWH}`
        )
        .then(res => {
          if (!res.ok || !res.body.length)
            return window.vm.$f7.addNotification({
              message: "No locations found for this warehouse",
              hold: 2000
            });

          this.allLocationsForWh = res.body;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    setAutocomplete() {
      this.autoCompleteRef && this.autoCompleteRef.destroy();

      this.autoCompleteRef = window.vm.$f7.autocomplete({
        openIn: "popup", //open in popup
        opener: window.vm.Dom7("#autocomplete-dropdown"), //link that opens autocomplete
        backOnSelect: true, //go back after we select something
        textProperty: "code",
        autoFocus: true,
        valueProperty: "id",
        source: (autocomplete, query, render) => {
          const results = this.allLocationsForWh.filter(({ code }) =>
            code.toLowerCase().includes(query.toLowerCase())
          );
          render(results);
        },
        onChange: (autocomplete, value) => {
          // Add item text value to item-after
          window.vm
            .Dom7("#autocomplete-standalone-popup-2")
            .find(".item-after")
            .text(value[0].code);
          this.scannedLocationCode = value[0];
        },
        onOpen: () => {
          this.scannedLocationCode = null;
        }
      });
      this.autoCompleteRef.open();
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

    this.isWhAssigned =
      window.vm.$pzGlobalReactiveData &&
      window.vm.$pzGlobalReactiveData.warehouse &&
      !!window.vm.$pzGlobalReactiveData.warehouse.id;

    if (this.isWhAssigned) {
      this.selectedWH = window.vm.$pzGlobalReactiveData.warehouse.id;
      this.fetchAllLocationsForWH();
    } else this.getWH();

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
    this.autoCompleteRef && this.autoCompleteRef.destroy();
  }
};
</script>
