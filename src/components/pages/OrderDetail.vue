<template>
    <f7-page name="OrderDetail">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Order Detail
            </f7-nav-center>
        </f7-navbar>

        <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
            <div class="row pz-padding-tb-4 pz-padding-lr16">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Status:</span>
                <div class="col-65">
                    <span class="status pz-padding-lr16 ">{{statusText}}</span>
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
            <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest" v-if="data.order_status === 5 || data.order_status === 6">
                <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Bilty:</span>
                <div class="col-65" v-if="!biltyImage && data.order_status === 5">
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
                <div class="col-65" v-if="biltyImage">
                    <img :src="biltyImage" class="pz-width100">
                </div>
            </div>
        </section>
        <section v-if="data && data.orderProduct && data.orderProduct.length">
            <f7-block-title>Books' details:</f7-block-title>
            <div class="data-table pz-margin-8 pz-shadow">
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
                            <td class="numeric-cell">{{p.product.mrp | moneyFormat}}</td>
                            <td class="numeric-cell">{{p.quantity}}</td>
                            <td class="numeric-cell">{{p.procurement_discount}}%</td>
                            <td class="numeric-cell">{{p.discount_percent}}</td>
                            <td class="numeric-cell">{{p.selling_price | moneyFormat}}</td>
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
            errMsg: null,
            imgData: null,
            imgHeight: null,
            imgWidth: null
        };
    },
    computed: {
        statusText() {
            if (!this.data || !this.data.order_status) return null;
            switch (this.data.order_status) {
                case 1: return 'Received';
                case 2: return 'Confirmed';
                case 3: return 'Being Procured';
                case 4: return 'Being Packed';
                case 5: return 'Dispatched'; // 5 could be for both partially and fully dispatched, so instead just say dispatched
                case 6: return 'Fulfilled';
                case 0: return 'Cancelled';

                default: return 'ERR';
            }
        },
        biltyImage() {
            if (!this.data || !this.data.orderStatus) return null;
            let dispatchData = this.data.orderStatus.find(x => x.status_id === 5);
            if (!dispatchData || !dispatchData.bill_t_file_name) return null;
            return window._pz.uploadsEndPt + 'billt/' + dispatchData.bill_t_file_name;
        }
    },
    methods: {
        getDetails() {
            this.pendingReq = true;
            window.vm.$http.get(`${window._pz.apiEndPt}orders/${this.id}`)
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
                    // let res = window._pz.imgData;
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
            window.vm.$http.patch(`${window._pz.apiEndPt}orders?id=${this.data.id}updateType=general`, {
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
