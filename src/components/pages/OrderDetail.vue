<template>
    <section>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left" id="backBtn">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">Order Detail</div>
            </div>
        </div>
        <f7-page name="OrderDetail">

            <!-- <f7-navbar back-link="Back">
                                                                        <f7-nav-center>
                                                                            Order Detail
                                                                        </f7-nav-center>
                                                                    </f7-navbar> -->

            <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
                <list-item :label="'Status'">
                    <span class="status pz-padding-lr16 ">{{statusText}}</span>
                </list-item>
                <list-item :label="'Order ID'" :value="data.order_id" :grayback="true" />
                <list-item :label="'Mobile No'" :value="data.order_id">
                    <a @click="$pzGlobalReactiveData.phone(data.user.mobile)">{{data.user.mobile}}</a>
                </list-item>
                <list-item :label="'Buyer Name'" :value="data.user.buyer_name" :grayback="true" />
                <list-item :label="'Invoice Amt'">
                    <span>Rs. {{data.finalOrderValue | moneyFormat}}</span>
                </list-item>
                <list-item :label="'Created Date'" :value="data.created_date" :grayback="true" />
                <list-item :label="'Carrier'" :value="carrierName" v-if="carrierName" />

                <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest" v-if="isPartiallyDispatched && carriers && !biltyImage">
                    <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Select Carrier</span>
                    <span class="col-65 ">
                        <a href="#" class="item-link smart-select" data-open-in="popup" data-back-on-select="true">
                            <select name="carrier" v-model="selectedCarrier">
                                <option v-for="c in carriers" :key="c.id" :value="c.id">{{c.carrier.name}}</option>
                            </select>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-after">{{selectedCarrier || 'Tap here'}}</div>
                                </div>
                            </div>
                            <a href="#" class="button button-raised pz-flex-sa-c pz-bg-gray-white" @click="uploadImage()" v-if="selCrrName && selCrrName.toLowerCase() === 'local transport'">
                                Fully Dispatch
                                <icon name="rocket"></icon>
                            </a>
                        </a>
                    </span>
                </div>
                <!-- upload images only when selected carrier is not local transport -->
                <div class="row pz-padding-tb-4 pz-padding-lr16 pz-bg-gray-lightest" v-if="data.order_status>=5 && (!selCrrName || selCrrName.toLowerCase() !== 'local transport')">
                    <span class="col-35 pz-wht-spc-norm color-gray pz-weight-thin ">Bilty:</span>
                    <div class="col-65" v-if="!biltyImage && isPartiallyDispatched">
                        <image-uploader :maxCount="1" :submitLabel="'Upload Bilty'" @upload="uploadImage($event)" :disabled="!selectedCarrier" />
                    </div>
                    <div class="col-65" v-if="biltyImage">
                        <img :src="biltyImage" class="pz-margin-r8 image" @click="$pzGlobalReactiveData.openZoomView(biltyImage)">
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
                                <td class="numeric-cell">{{p.amount | moneyFormat}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <div class="color-gray pz-page-err" v-if="!data && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>

        </f7-page>
    </section>
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
import ListItem from '../shared/ListItem';

export default {
    name: 'OrderDetail',
    components: {
        'image-uploader': ImageUploader,
        'list-item': ListItem
    },
    data() {
        return {
            data: null,
            id: null,
            errMsg: null,
            carriers: null,
            selectedCarrier: null
        };
    },
    computed: {
        selCrrName() {
            if (!this.selectedCarrier) return null;
            else return this.carriers.find(x => x.id === this.selectedCarrier).carrier.name;
        },
        biltyImage() {
            if (!this.data || !this.data.orderStatus) return null;
            let dispatchData = this.data.orderStatus.find(x => x.status_id === 5);
            if (!dispatchData || !dispatchData.bill_t_file_name) return null;
            return window._pz.uploadsEndPt + 'billt/' + dispatchData.bill_t_file_name;
        },
        isPartiallyDispatched() {
            return this.data && this.data.order_status === 5 &&
                !this.data.orderStatus.some(el => el.status_id === 5 && el.bill_t_file_name) &&
                !this.data.orderStatus.some(el => el.status_id === 5 && el.carrierTransportationDays);
        },
        statusText() {
            if (!this.data || !this.data.order_status) return null;
            else if (this.data.order_status === 5 && typeof this.isPartiallyDispatched !== 'undefined') {
                return this.isPartiallyDispatched ? 'Part. Dispatched' : 'Fully Dispatched';
            }
            else {
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
            }
        },
        carrierName() {
            const idxStatus5 = this.data && this.data.orderStatus &&
                this.data.orderStatus.findIndex(el => el.status_id === 5 && el.carrierTransportationDays);

            if (idxStatus5 !== -1) return this.data.orderStatus[idxStatus5].carrierTransportationDays.carrier.name;
            else return null;
        }
    },
    methods: {
        getDetails() {
            window.vm.$http.get(`${window._pz.apiEndPt}orders/${this.id}`)
                .then(res => {
                    if (res.ok) {
                        this.data = res.body;

                        const adr = res.body.user.userAddress;
                        let shippingCityID = adr.length === 1 ? adr[0].city.id : adr.find(x => x.address_type === 1).city.id;
                        this.getCarriers(shippingCityID);
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getCarriers(cityID) {
            window.vm.$http.get(window._pz.apiEndPt + 'city/carriers?city=' + cityID)
                .then(res => {
                    if (res.ok) this.carriers = res.body;
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        uploadImage(image) {
            const params = image ? {
                stringValue: image[0].data,
                name: image[0].title
            } : null;

            window.vm.$http.patch(`${window._pz.apiEndPt}orders?id=${this.data.id}&modified_by=${localStorage.userID}&updateType=status&carrierId=${this.selectedCarrier}`, params)
                .then(res => {
                    // override default back button to load the previous page afresh in order to see the recently made changes to this order
                    const allOrdersFilters = this.$route.options.context.allOrdersFilters;
                    setTimeout(() => this.overrideDefaultBack(allOrdersFilters));

                    window.vm.$f7.addNotification({ message: 'Status changed', hold: 2000 });

                    window.vm.$f7.mainView.router.refreshPage();
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        overrideDefaultBack(allOrdersFilters) {
            let prevPage = window.vm.$f7.mainView.history[window.vm.$f7.mainView.history.length - 2];
            window.Dom7('#backBtn')[0].addEventListener('click', e => {
                // prevent default back button behaviour
                e.preventDefault();
                e.stopPropagation();
                window.vm.$f7.mainView.router.load({
                    url: prevPage,
                    reload: true,
                    context: { comps: allOrdersFilters }
                });
            });
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
