<template>
    <f7-page name="OrderDetail">

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
                <div class="col-65" v-if="!data.image">
                    <a href="#" class="button button-raised pz-flex-sa-c pz-width100 pz-bg-gray-white" @click="uploadChoices()" id="uploadImgBtn" v-if="!imgData">
                        Upload image
                        <icon name="cloud-upload"></icon>
                    </a>
                    <div v-if="imgData">
                        <!-- <div :style="styleObject" valign="bottom" class="card-header color-white no-border pz-card-head"></div> -->
                        <img :src="imgData" class="pz-width100">
                        <div class="card-footer" style="justify-content: flex-end;">
                            <a href="#" class="button color-red" @click="imgData=null">Cancel</a>
                            <a href="#" class="button">Upload</a>
                        </div>
                    </div>
                </div>
                <div class="col-65" v-if="data.image">
                    <img src="http://via.placeholder.com/1500x1000" class="pz-width100">
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
        styleObject: function() {
            const width = window.Dom7('#uploadImgBtn').width();
            console.log('width: ', width);
            let height = parseInt(width * this.imgHeight / this.imgWidth) + 'px';
            console.log('height: ', height);
            let obj = {
                'background-image': `url( ${this.imgData} )`,
                'height': height
            };
            return obj;
        }
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
            if (!navigator.camera) return;
            // let id = this.data.id;
            navigator.camera.getPicture(
                res => {
                    let resx = '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';
                    console.log(typeof resx);
                    this.imgData = 'data:image/jpeg;base64,' + res;

                    // set the height of card
                    // var i = new Image();
                    // i.onload = () => { this.imgHeight = i.height; this.imgWidth = i.width; };
                    // i.src = this.imgData;
                },
                err => { throw new Error(err); },
                {
                    'destinationType': window.Camera.DestinationType.DATA_URL,
                    'sourceType': window.Camera.PictureSourceType[source],
                    'quality': 30,
                    'encodingType': window.Camera.EncodingType.JPEG
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
