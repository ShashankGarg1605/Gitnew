<template>
  <f7-page name="DebitNoteDetails">
    <f7-navbar back-link="Back" sliding>
      <f7-nav-center>Debit Note Details</f7-nav-center>
    </f7-navbar>

    <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
      <div class="row pz-padding-tb-4 pz-padding-lr16">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">Status:</span>
        <div class="col-65">
          <span class="status pz-padding-lr16">{{data.status == 0 ? 'Open': 'Complete'}}</span>
        </div>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">ID:</span>
        <span class="col-65">{{data.id}}</span>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">DN Number:</span>
        <span class="col-65">{{data.debit_note_number}}</span>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">Value:</span>
        <span class="col-65">{{data.value | moneyFormat}}</span>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">Books:</span>
        <span class="col-65">{{data.total_quantity}}</span>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">Supplier:</span>
        <span
          class="col-65"
        >{{data.publisher ? data.publisher.name : data.distributors.distributor_name}}</span>
      </div>
      <div class="row pz-padding-tb-4 pz-padding-lr16">
        <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin">DN Date:</span>
        <span class="col-65">{{data.generated_date ? data.generated_date: ''| dateFormat}}</span>
      </div>
    </section>

    <section v-if="data && data.debitNotesProducts && data.debitNotesProducts.length">
      <f7-block-title>Details:</f7-block-title>
      <div class="data-table pz-margin-8 pz-shadow">
        <table class="equalDivide">
          <thead class="pz-bg-gray-lightest">
            <tr>
              <th style="width:5px;" class="numeric-cell">!</th>
              <th class="numeric-cell">#</th>
              <th style="width:60px;" class="label-cell">Isbn</th>
              <th style="width:200px;" class="label-cell">Title</th>
              <th style="width:100px;" class="label-cell">Brand</th>
              <th class="numeric-cell">MRP</th>
              <th class="numeric-cell pz-padding-0">Quantity</th>
              <!-- <th class="numeric-cell pz-padding-0">Current QTY</th> -->
              <th class="numeric-cell pz-padding-0">Discount %</th>
              <th class="numeric-cell pz-padding-0">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, index) in data.debitNotesProducts" :key="p.id">
              <td class="numeric-cell" @click="removeItem(p.id)">
                <icon name="trash"></icon>
              </td>
              <td class="numeric-cell">{{index+1}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].isbn}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].title}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].publisher.name}}</td>
              <td class="numeric-cell">{{p.mrp | moneyFormat}}</td>
              <td class="numeric-cell">{{p.quantity}}</td>
              <!-- <td class="numeric-cell">{{p.quantity}}</td> -->
              <td class="numeric-cell">{{p.discount_percent}}%</td>
              <td class="numeric-cell">{{p.amount | moneyFormat}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="add-section" v-if="allowAddItems">
      <button
        type="button"
        @click="addItem()"
        class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
        v-if="!scannedItem"
      >Add item</button>
      <button
        type="button"
        @click="addItem()"
        class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32"
        v-if="scannedItem"
      >Select another</button>

      <li class="product" v-if="scannedItem">
        <div class="left">
          <img v-if="scannedItem.image_url" :src="scannedItem.image_url">
          <img v-if="!scannedItem.image_url" src="../../../assets/cover.jpg">
        </div>
        <div class="right">
          <div class="title">{{scannedItem.title}}</div>
          <div class="info">
            <span class="key col-35">ISBN:</span>
            <span class="value col-65">{{scannedItem.isbn}}</span>
          </div>

          <div class="info">
            <span class="key col-35">Enter Qty:</span>
            <span class="value col-65">
              <input type="number" min="1" v-model="enteredQty">
            </span>
          </div>

          <button
            type="button"
            @click="doAddItem()"
            class="button button-raised"
            v-if="enteredQty>0"
          >Add it!</button>
        </div>
      </li>
    </div>

    <div class="color-gray pz-page-err" v-if="!data && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>
  </f7-page>
</template>

<style scoped>
.equalDivide {
  table-layout: fixed !important;
  width: 1000px;
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

input {
  padding: 10px !important;
  border: 1px dashed lightgrey !important;
  border-radius: 10px !important;
  background: #fafafa !important;
  width: 50px;
  font-size: initial;
  font-weight: lighter;
}
</style>

<script>
export default {
  name: "DebitNoteDetails",
  data() {
    return {
      data: null,
      id: null,
      errMsg: null,
      allowAddItems: null,
      scannedItem: null,
      enteredQty: null
    };
  },
  computed: {
    isForPublisher() {
      return this.data && this.data.publisher && this.data.publisher.id;
    }
  },
  methods: {
    getDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}debit_notes/${this.id}`)
        .then(res => {
          if (res.ok) this.data = res.body;
        })
        .catch(window._pz.errFunc2.bind(this));
    },
    addItem() {
      this.scannedItem = null;
      window.vm.$pzGlobalReactiveData
        .scanCode()
        .then(res => {
          const scannedProductIsbn = res.text;
          if (scannedProductIsbn) {
            window.vm.$http
              .get(`${window._pz.apiEndPt}products?isbn=${scannedProductIsbn}`)
              .then(res => {
                if (!res.ok || !res.body.length)
                  return window.vm.$f7.addNotification({
                    message: "No product found with ISBN " + scannedProductIsbn,
                    hold: 2000
                  });

                const scannedItem = res.body[0];
                if (
                  this.isForPublisher &&
                  (!scannedItem.publisher ||
                    !scannedItem.publisher.id ||
                    this.data.publisher.id !== scannedItem.publisher.id)
                )
                  return window.vm.$f7.addNotification({
                    message: "This product cannot be added",
                    hold: 2000
                  });

                this.scannedItem = scannedItem;
              })
              .catch(err => {
                console.log("err: ", err);
                return window.vm.$f7.addNotification({
                  message: "No product found with ISBN " + scannedProductIsbn,
                  hold: 2000
                });
              });
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
    doAddItem() {
      const param = {
        debitNotes: {
          id: this.data.id,
          warehouse: {
            id: this.data.warehouse.id
          }
        },
        product: {
          id: this.scannedItem.id
        },
        mrp: this.scannedItem.mrp,
        discount_percent: 0,
        quantity: parseInt(this.enteredQty),
        status: 0
      };

      window.vm.$http
        .post(`${window._pz.apiEndPt}debit_notes_product`, param)
        .then(res => {
          if (res.ok) window.vm.$f7.mainView.router.refreshPage();
        })
        .catch(err => {
          console.log("err: ", err);
          if (err.status === 409)
            window.vm.$f7.addNotification({
              message: err.body.message,
              hold: 2000
            });
          else window._pz.errFunc2.call(this, err);
        });
    },
    removeItem(productId) {
      window.vm.$f7.confirm(
        `Sure you want to delete this item?`,
        "Confirm",
        this.doRemoveItem.bind(this, productId)
      );
    },
    doRemoveItem(productId) {
      window.vm.$http
        .delete(`${window._pz.apiEndPt}debit_notes_product/${productId}`)
        .then(res => {
          if (res.ok) window.vm.$f7.mainView.router.refreshPage();
        })
        .catch(window._pz.errFunc2.bind(this));
    }
  },

  beforeCreate() {
    console.debug(this.$options.name + " beforeCreate");
  },
  created() {
    console.debug(this.$options.name + " created");
    this.id = this.$route.query && this.$route.query.id;
    this.allowAddItems =
      this.$route.query && parseInt(this.$route.query.allowAddItems);
    this.getDetails();
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
