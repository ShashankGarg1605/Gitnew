<template>
    <f7-page name="PurchaseInvoiceDetail">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Purchase Invoice Detail
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
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">ID:</span>
                <span class="col-65 ">{{data.id}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Invoice No:</span>
                <span class="col-65 ">{{data.invoice_number}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Value:</span>
                <span class="col-65 ">{{data.value | moneyFormat}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Books:</span>
                <span class="col-65 ">{{data.total_books}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Supplier:</span>
                <span class="col-65 ">{{data.publisher ? data.publisher.name : data.distributors.distributor_name}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Invoice Date:</span>
                <span class="col-65 ">{{data.invoice_date | dateFormat}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Invoice:</span>
                <div class="col-65" v-if="!invoiceImages && $pzGlobalReactiveData.roleAccess('inventory', 'update')">
                    <image-uploader :maxCount="4" :submitLabel="'Upload Invoice'" :tooltip="true" @upload="uploadImage($event)" />
                </div>
                <div class="col-65" v-if="invoiceImages">
                    <img v-for="(image, index) in invoiceImages" :key="index" :src="image" class="pz-margin-r8 image" @click="openZoomView(index)">
                </div>
            </div>
        </section>

        <section v-if="data && data.stock && data.stock.length">
            <f7-block-title>Books' details:</f7-block-title>
            <div class="data-table pz-margin-8 pz-shadow">
                <table class="equalDivide">
                    <thead class="pz-bg-gray-lightest">
                        <tr>
                            <th style="width:1px;" class="numeric-cell">#</th>
                            <th style="width:60px;" class="label-cell">Isbn</th>
                            <th style="width:200px;" class="label-cell">Title</th>
                            <th style="width:100px;" class="label-cell">Brand</th>
                            <th class="numeric-cell">MRP</th>
                            <th class="numeric-cell pz-padding-0">Original QTY</th>
                            <!-- <th class="numeric-cell pz-padding-0">Current QTY</th> -->
                            <th class="numeric-cell pz-padding-0">Buy %</th>
                            <th class="numeric-cell pz-padding-0">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in data.stock" :key="p.id">
                            <td class="numeric-cell">{{index+1}}</td>
                            <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].isbn}}</td>
                            <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].title}}</td>
                            <td class="label-cell">{{p[p.product? 'product' : 'otherProduct'].publisher.name}}</td>
                            <td class="numeric-cell">{{p.mrp | moneyFormat}}</td>
                            <td class="numeric-cell">{{p.original_quantity}}</td>
                            <!-- <td class="numeric-cell">{{p.quantity}}</td> -->
                            <td class="numeric-cell">{{p.procurement_discount}}%</td>
                            <td class="numeric-cell">{{(p.mrp - (p.mrp*p.procurement_discount/100))*p.original_quantity | moneyFormat}}</td>
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
import ImageUploader from '../shared/ImageUploader';

export default {
    name: 'PurchaseInvoiceDetail',
    data() {
        return {
            data: null,
            id: null,
            errMsg: null
        };
    },
    components: {
        'image-uploader': ImageUploader
    },
    computed: {
        invoiceImages() {
            if (!this.data || !this.data.image) return null;
            const images = this.data.image.split(', ');
            images.pop();
            return images.map(i => window._pz.uploadsEndPt + 'purchase-invoice/' + i);
        }
    },
    methods: {
        getDetails() {
            window.vm.$http.get(`${window._pz.apiEndPt}purchase_invoice/${this.id}`)
                .then(res => {
                    if (res.ok) this.data = res.body;
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        uploadImage(images) {
            let params = images.map(image => ({
                stringValue: image.data,
                name: image.title
            }));

            window.vm.$http.patch(`${window._pz.apiEndPt}purchase_invoice?updateType=general`, {
                id: this.data.id,
                images: params
            })
                .then(res => {
                    window.vm.$f7.mainView.router.refreshPage();
                    window._pz.refreshOnBack = true;
                    window.vm.$f7.addNotification({ message: 'Invoice uploaded successfully', hold: 2000 });
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        openZoomView(index) {
            var a = window.vm.$f7.photoBrowser({
                type: 'popup',
                theme: 'dark',
                toolbar: true,
                initialSlide: index,
                photos: this.invoiceImages
            }); a.open();
        }
    },

    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.id = this.$route.query && this.$route.query.id;
        this.getDetails();
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
