<template>
    <f7-page name="PurchaseInvoiceDetail">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Purchase Invoice Detail
            </f7-nav-center>
        </f7-navbar>

        <!-- <div class="lorem">
                                                    <p class="alert pz-bg-gray-lighter pz-padding-16 content-block-title">Invoice image not uploaded!</p>
                                                    <p class="content-block-title">Upload now using:</p>
                                                    <div class="buttons-row content-block">
                                                        <a href="#" class="button button-fill button-raised color-blue" @click="getImage('CAMERA')">Camera</a>
                                                        <a href="#" class="button button-fill button-raised color-blue" @click="getImage('PHOTOLIBRARY')">Gallery</a>
                                                    </div>

                                                    <div class="card demo-card-header-pic" v-if="imgData">
                                                        <div :style="styleObject" valign="bottom" class="card-header color-white no-border pz-card-head"></div>
                                                        <div class="card-content">
                                                            <div class="card-content-inner">
                                                                <p>Upload this image?</p>
                                                            </div>
                                                        </div>
                                                        <div class="card-footer" style="justify-content: flex-end;">
                                                            <a href="#" class="button color-red" @click="imgData=null">Cancel</a>
                                                            <a href="#" class="button color-blue">Upload</a>
                                                        </div>
                                                    </div>
                                                </div> 
                                                <hr> -->

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
                <span class="col-65 ">Rs. {{data.value | moneyFormat}}</span>
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
                <span class="col-65 ">{{data.invoice_date}}</span>
            </div>
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Image:</span>
                <div class="col-65" v-if="!invoiceImage">
                    <a href="#" class="button button-raised pz-flex-sa-c pz-width100 pz-bg-gray-white" @click="uploadChoices()" id="uploadImgBtn" v-if="!imgData">
                        Upload image
                        <icon name="cloud-upload"></icon>
                    </a>
                    <div v-if="imgData">
                        <!-- <div :style="styleObject" valign="bottom" class="card-header color-white no-border pz-card-head"></div> -->
                        <img :src="imgData" class="pz-width100">
                        <div class="card-footer" style="justify-content: flex-end;">
                            <a href="#" class="button color-red" @click="imgData=null">Cancel</a>
                            <a href="#" class="button" @click="uploadImage()">Upload</a>
                        </div>
                    </div>
                </div>
                <div class="col-65" v-if="invoiceImage">
                    <img :src="invoiceImage" class="pz-width100">
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
                            <th style="width:100px;" class="label-cell">Publisher</th>
                            <th class="numeric-cell">MRP</th>
                            <th class="numeric-cell pz-padding-0">Original QTY</th>
                            <th class="numeric-cell pz-padding-0">Current QTY</th>
                            <th class="numeric-cell pz-padding-0">Buy %</th>
                            <th class="numeric-cell pz-padding-0">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in data.stock" :key="p.id">
                            <td class="numeric-cell">{{index+1}}</td>
                            <td class="label-cell">{{p.product.isbn}}</td>
                            <td class="label-cell">{{p.product.title}}</td>
                            <td class="label-cell">{{p.product.publisher.name}}</td>
                            <td class="numeric-cell">{{p.product.mrp | moneyFormat}}</td>
                            <td class="numeric-cell">{{p.original_quantity}}</td>
                            <td class="numeric-cell">{{p.quantity}}</td>
                            <td class="numeric-cell">{{p.procurement_discount}}%</td>
                            <td class="numeric-cell">{{(p.product.mrp - (p.product.mrp*p.procurement_discount/100))*p.original_quantity | moneyFormat}}</td>
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


.alert {
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    border-radius: 3px;
}
</style>

<script>

export default {
    name: 'PurchaseInvoiceDetail',
    data() {
        return {
            data: null,
            id: null,
            pendingReq: false,
            errMsg: null,
            imgData: null,
            imgHeight: null,
            imgWidth: null
        };
    },
    computed: {
        invoiceImage() {
            if (!this.data || !this.data.image) return null;
            return window._pz.uploadsEndPt + 'purchase-invoice/' + this.data.image;
        }
    },
    methods: {
        getDetails() {
            this.pendingReq = true;
            window.vm.$http.get(`${window._pz.apiEndPt}purchase_invoice/${this.id}`)
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
        uploadChoices() {
            let buttons = [
                { text: 'Upload invoice using', label: true },
                {
                    text: 'Camera',
                    onClick: function() { this.getImage('CAMERA'); }.bind(this)
                },
                {
                    text: 'Gallery',
                    onClick: function() { this.getImage('PHOTOLIBRARY'); }.bind(this)
                }
            ];
            window.vm.$f7.actions(buttons);
        },
        getImage(source) {
            if (!navigator.camera) {
                // xxx
                let res = window._pz.imgData;
                this.imgData = 'data:image/jpeg;base64,' + res;
                // xxx
                return;
            }
            navigator.camera.getPicture(
                res => {
                    this.imgData = 'data:image/jpeg;base64,' + res;
                },
                err => { throw new Error(err); },
                {
                    'destinationType': window.Camera.DestinationType.DATA_URL,
                    'sourceType': window.Camera.PictureSourceType[source],
                    'quality': 30,
                    'encodingType': window.Camera.EncodingType.JPEG
                });
        },
        uploadImage() {
            window.vm.$f7.showPreloader();
            window.vm.$http.patch(`${window._pz.apiEndPt}purchase_invoice?updateType=general`, {
                image: 'randomfilename',
                id: this.data.id,
                imageData: this.imgData
            })
                .then(res => {
                    window.vm.$f7.hidePreloader();
                    window.vm.$f7.mainView.router.refreshPage();
                    window._pz.refreshOnBack = true;
                    window.vm.$f7.addNotification({ message: 'Image uploaded successfully', hold: 2000 });
                })
                .catch(error => {
                    window.vm.$f7.hidePreloader();
                    if (error instanceof Error) throw new Error(error);
                    else {
                        let msg;
                        if (typeof error === 'object' && error.status) msg = `Something went wrong. (Error ${error.status})`;
                        else if (error && !error.ok) msg = window._pz.err['ERR_NET'];

                        if (msg) window.vm.$f7.addNotification({ message: msg, hold: 2000 });
                    }
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
