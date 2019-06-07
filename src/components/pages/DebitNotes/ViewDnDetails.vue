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
              <th style="width:1px;" class="numeric-cell">#</th>
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
              <td class="numeric-cell">{{index+1}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].isbn}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].title}}</td>
              <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].publisher.name}}</td>
              <td class="numeric-cell">{{p.mrp | moneyFormat}}</td>
              <td class="numeric-cell">{{p.quantity}}</td>
              <!-- <td class="numeric-cell">{{p.quantity}}</td> -->
              <td class="numeric-cell">{{p.discount_percent}}%</td>
              <td
                class="numeric-cell"
              >{{p.amount | moneyFormat}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="color-gray pz-page-err" v-if="!data && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>
  </f7-page>
</template>

<style scoped>
.status {
  text-transform: uppercase;
  border: 1px solid green;
  border-radius: 5px;
  width: auto;
  color: #419688;
}

.equalDivide {
  table-layout: fixed !important;
  width: 1000px;
}
</style>

<script>

export default {
  name: "DebitNoteDetails",
  data() {
    return {
      data: null,
      id: null,
      errMsg: null
    };
  },

  methods: {
    getDetails() {
      window.vm.$http
        .get(`${window._pz.apiEndPt}debit_notes/${this.id}`)
        .then(res => {
          if (res.ok) this.data = res.body;
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
