<template>
    <f7-page name="OrderDetail">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Purchase Invoice Detail
            </f7-nav-center>
        </f7-navbar>

        <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 color-gray pz-weight-thin ">ID:</span>
                <span class="col-65 ">{{data.id}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 color-gray pz-weight-thin ">Invoice No.:</span>
                <span class="col-65 ">{{data.invoice_number}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 color-gray pz-weight-thin ">Value:</span>
                <span class="col-65 ">Rs. {{data.value | moneyFormat}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 color-gray pz-weight-thin ">Books:</span>
                <span class="col-65 ">{{data.total_books}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 color-gray pz-weight-thin ">Supplier:</span>
                <span class="col-65 ">{{data.publisher ? data.publisher.name : data.distributors.distributor_name}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 color-gray pz-weight-thin ">Invoice:</span>
                <span class="col-65 ">{{data.invoice_date}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 color-gray pz-weight-thin ">Status:</span>
                <div class="col-65">
                    <span class="status pz-padding-lr16 ">{{data.status == 0 ? 'Open': 'complete'}}</span>
                </div>
            </div>
        </section>

        <section v-if="data && data.stock && data.stock.length">
            <div class="data-table card">
                <table class="equalDivide">
                    <thead class="pz-bg-gray-lightest">
                        <tr>
                            <th style="width:1px;" class="numeric-cell">#</th>
                            <th style="width:60px;" class="label-cell">Isbn</th>
                            <th style="width:200px;" class="label-cell">Title</th>
                            <th style="width:100px;" class="label-cell">Publisher</th>
                            <th class="numeric-cell">MRP</th>
                            <th class="numeric-cell pz-padding-0">Original QTY</th>
                            <th class="numeric-cell pz-padding-0">Current QTY</th>
                            <th class="numeric-cell pz-padding-0">Buy %</th>
                            <th class="numeric-cell pz-padding-0">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(prod, index) in data.stock" :key="prod.id">
                            <td class="numeric-cell">{{index+1}}</td>
                            <td class="label-cell">{{prod.product.isbn}}</td>
                            <td class="label-cell">{{prod.product.title}}</td>
                            <td class="label-cell">{{prod.product.publisher.name}}</td>
                            <td class="numeric-cell">{{prod.product.mrp}}</td>
                            <td class="numeric-cell">{{prod.original_quantity}}</td>
                            <td class="numeric-cell">{{prod.quantity}}</td>
                            <td class="numeric-cell">{{prod.procurement_discount}}%</td>
                            <td class="numeric-cell">?????</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <div class="color-gray pz-page-err" v-if="!data && !pendingReq">{{errMsg}}</div>
    </f7-page>
</template>

<style scoped>
.pz-page-err {
    font-style: italic;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10%;
}

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



/* .equalDivide tr td,
.equalDivide tr th {
    width: 10%;
} */
</style>

<script>

export default {
    name: 'PurchaseInvoiceDetail',
    data() {
        return {
            data: null,
            id: null,
            pendingReq: false,
            errMsg: null
        };
    },
    methods: {
        getDetails() {
            this.pendingReq = true;
            window.vm.$http.get('http://staging.prozo.com/api/v3/purchase_invoice/' + this.id)
                .then(res => {
                    this.pendingReq = false;
                    if (res.ok) this.data = res.body;
                })
                .catch(err => {
                    if (err instanceof Error) throw new Error(err);

                    this.pendingReq = false;
                    this.errMsg = window._pz.errFunc(err);
                });
        }
    },
    filters: {
        moneyFormat(data) {
            if (!data) return '';
            data = parseInt(data);
            data = data.toString();
            var lastThree = data.substring(data.length - 3);
            var otherNumbers = data.substring(0, data.length - 3);
            if (otherNumbers !== '') lastThree = ',' + lastThree;
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        }
    },
    created: function() {
        console.log('Purchase Invoice Detail created');
        console.log('this.$route: ', this.$route);
        this.id = this.$route.query && this.$route.query.id;
        this.getDetails();
    }
};
</script>
