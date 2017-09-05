<template>
    <f7-page name="OrderDetail" pull-to-refresh @ptr:refresh="onPullToRefresh">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Order Detail
            </f7-nav-center>
        </f7-navbar>

        <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Status:</span>
                <div class="col-65">
                    <span class="status pz-padding-lr16 ">{{data.status == 0 ? 'Open': 'complete'}}</span>
                </div>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Order ID:</span>
                <span class="col-65 ">{{data.order_id}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Mobile No:</span>
                <span class="col-65 ">{{data.user.mobile}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Buyer Name:</span>
                <span class="col-65 ">{{data.user.buyer_name}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Invoice Amt:</span>
                <span class="col-65 ">Rs. {{data.finalOrderValue | moneyFormat}}</span>
            </div>
        </section>
        <section v-if="data && data.orderProduct && data.orderProduct.length">
            <div class="data-table card">
                <table class="equalDivide">
                    <thead class="pz-bg-gray-lightest">
                        <tr>
                            <th style="width:1px;" class="numeric-cell">#</th>
                            <th style="width:200px;" class="label-cell">Title</th>
                            <th style="width:100px;" class="label-cell">Publisher</th>
                            <th class="numeric-cell">MRP</th>
                            <th class="numeric-cell pz-padding-0">QTY</th>
                            <th class="numeric-cell pz-padding-0">Buy %</th>
                            <th class="numeric-cell">Discount</th>
                            <th class="numeric-cell pz-padding-0">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in data.orderProduct" :key="p.id">
                            <td class="numeric-cell">{{index+1}}</td>
                            <td class="label-cell">{{p.product.title}}</td>
                            <td class="label-cell">{{p.product.publisher.name}}</td>
                            <td class="numeric-cell">{{p.product.mrp}}</td>
                            <td class="numeric-cell">{{p.quantity}}</td>
                            <td class="numeric-cell">{{p.procurement_discount}}%</td>
                            <td class="numeric-cell">{{p.discount_percent}}</td>
                            <td class="numeric-cell">{{p.selling_price}}</td>
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
</style>
<script>
export default {
    name: 'AllOrders',
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
            window.vm.$http.get('http://staging.prozo.com/api/v3/orders/' + this.id)
                .then(res => {
                    this.pendingReq = false;
                    if (res.ok) this.data = res.body;
                })
                .catch(err => {
                    if (err instanceof Error) throw new Error(err);

                    this.pendingReq = false;
                    this.errMsg = window._pz.errFunc(err);
                });
        },
        onPullToRefresh() {
            window.vm.$f7.mainView.router.refreshPage();
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
        console.log('Order Detail created');
        this.id = this.$route.options.context && this.$route.options.context.id;
        this.getDetails();
    }
};
</script>
