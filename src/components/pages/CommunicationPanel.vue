<template>
    <f7-page tabs no-page-content toolbar-fixed>

        <f7-navbar>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Communication Panel
            </f7-nav-center>
        </f7-navbar>
        <f7-toolbar tabbar>
            <a href="#" data-tab="#tab-1" class="tab-link active" :disabled="!userID">Buyer Details</a>
            <a href="#" data-tab="#tab-2" class="tab-link" :disabled="!userID">Comms Panel</a>
        </f7-toolbar>
        <f7-tabs swipeable>
            <f7-page-content tab active id="tab-1">
                <div class="list-block pz-margin-top0">
                    <a href="#" id="autocomplete-standalone-popup-2" class="item-link item-content autocomplete-opener" @click="openUserSelection()">
                        <input type="hidden" id="usersearch" v-model="userID">
                        <div class="item-inner">
                            <div class="item-title">Select User</div>
                            <div class="item-after"></div>
                        </div>
                    </a>
                </div>

                <section v-if="userID">

                    <f7-list accordion>
                        <f7-list-item accordion-item title="Basic Details" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Name'" :value="userDetails.name" :grayback="true" />
                                    <list-item :label="'Owner Name'" :value="userDetails.owner_name" />
                                    <list-item :label="'Account since'" :value="userDetails.created_date | dateFormat" :grayback="true" />
                                    <list-item :label="'Mobile'">
                                        <a @click="$pzGlobalReactiveData.phone(userDetails.mobile)">{{userDetails.mobile}}</a>
                                    </list-item>
                                    <list-item :label="'2nd Mobile'" :grayback="true">
                                        <a @click="$pzGlobalReactiveData.phone(userDetails.alternate_mobile)">{{userDetails.alternate_mobile}}</a>
                                    </list-item>
                                    <list-item :label="'Type'" :value="userDetails.buyerType" />
                                    <list-item :label="'Email'" :value="userDetails.email" :grayback="true" />
                                    <list-item :label="'Last app use'" :value="userDetails.last_app_use | dateFormat" />
                                    <list-item :label="'Account type'" :value="$pzGlobalReactiveData.accountTypeMap[userDetails.account_type]" :grayback="true" />
                                    <!-- <list-item :label="'Account opening form'" :value="userDetails.account_opening_form" /> -->
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Profile summary" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <p class="pz-bg-gray-lighter pz-border-radius-10 pz-padding-16">{{userDetails.profile_summary || '(Not available)'}}</p>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Relationship Manager Details" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Mgr name'" :value="userDetails.rm_name" />
                                    <list-item :label="'Mgr mobile'" :value="userDetails.rm_mobile" :grayback="true" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Business Details" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Total business till date'">
                                        <span>Rs. {{totalOrderValue | moneyFormat}}</span>
                                    </list-item>
                                    <list-item :label="'Avg order value'" :grayback="true">
                                        <span>Rs. {{avgOrderValue | moneyFormat}}</span>
                                    </list-item>
                                    <list-item :label="'Total Orders till date'" :value="businessDetails && businessDetails.length" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Logistics Details" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Goods carrier'" :value="userDetails.carrier_info && userDetails.carrier_info.carrier && userDetails.carrier_info.carrier.name" />
                                    <list-item :label="'Carrier mobile'" :value="userDetails.carrier_info && userDetails.carrier_info.carrier && userDetails.carrier_info.carrier.mobile" :grayback="true" />
                                    <list-item :label="'Avg duration of goods delivery'" :value="userDetails.carrier_info && userDetails.carrier_info.transporting_days" />
                                    <list-item :label="'Logistics paid by'" :value="userDetails.logisticStatus" :grayback="true" />
                                    <list-item :label="'Bilty reqments'" :value="userDetails.billty_code" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Buyer Addresses" v-if="userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <div v-if="registeredAddr" style="border: 1px dashed lightgrey;">
                                        <list-item :label="'Address type'" :value="'Registered'" />
                                        <list-item :label="'Name'" :value="registeredAddr.name" :grayback="true" />
                                        <list-item :label="'Address'" :value="registeredAddr.address" />
                                        <list-item :label="'Landmark'" :value="registeredAddr.landmark" :grayback="true" />
                                        <list-item :label="'City (state)'" :value="registeredAddr.city.name + ' (' + registeredAddr.city.state.name + ')'" />
                                    </div>
                                    <div v-if="shippingAddr" style="border: 1px dashed lightgrey; margin-top: 8px;">
                                        <list-item :label="'Address type'" :value="'Shipping'" />
                                        <list-item :label="'Name'" :value="shippingAddr.name" :grayback="true" />
                                        <list-item :label="'Address'" :value="shippingAddr.address" />
                                        <list-item :label="'Landmark'" :value="shippingAddr.landmark" :grayback="true" />
                                        <list-item :label="'City (state)'" :value="shippingAddr.city.name + ' (' + shippingAddr.city.state.name + ')'" />
                                    </div>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Return Details" v-if="returnDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'No. of returns'" :value="returnDetails.length" />
                                    <list-item :label="'Total value till date'" :value="returnDetails.reduce((sum,v)=>sum+v.approved_value, 0) | moneyFormat" :grayback="true" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Payment Details" v-if="lastPaymentDetails && userDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Overall outstanding'" :value="userDetails.payment_due | moneyFormat" />
                                    <list-item :label="'Bad debt'" :value="userDetails.bad_debt | moneyFormat" :grayback="true" />
                                    <list-item :label="'Last paid amount'" :value="lastPaymentDetails.amount" />
                                    <list-item :label="'Mode of last payment'" :value="lastPaymentDetails.method" :grayback="true" />
                                    <list-item :label="'Date of last payment'" :value="lastPaymentDetails.recieved_date | dateFormat" />
                                    <list-item :label="'Credit days'" :value="userDetails.credit_period" :grayback="true" />
                                    <list-item :label="'Credit limit'" :value="userDetails.credit_limit" />
                                    <list-item :label="'Due after last payment'" :value="userDetails.collection_due | moneyFormat" />
                                    <list-item v-if="chqBounceDetails" :label="'No of cheque bounces'" :value="chqBounceDetails.length" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Buyer Discount Exceptions" v-if="userDiscountDetails">
                            <f7-accordion-content>
                                <f7-block>
                                    <div style="display: flex; justify-content: flex-end;">
                                        <span>(Buyer%)</span>
                                        <span class="pz-padding-lr16">Current%</span>
                                    </div>
                                    <list-item v-for="(d, index) in userDiscountDetails" :key="index" :label="d.publisherCategory.category_name" :value=" '('+d.publisherCategory.distributor_discount+') '+d.publisherCategory.distributor_discount" :grayback="index%2==0" :leftColWidth="65" :rightColWidth="35" />

                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Conversation with Buyer" v-if="buyerConversations">
                            <f7-accordion-content>
                                <f7-block>
                                    <span class="color-gray pz-size-small">Only latest 10 results are shown</span>
                                    <div v-for="(msg, index) in buyerConversations" :key="index" class="message" :class="{'pz-bg-gray-lightest': index%2==0}">
                                        <div style="display: flex; justify-content: space-between; font-size: smaller; font-weight: bold;">
                                            <span>{{msg.message_datetime | dateFormat}}</span>
                                            <span>{{msg.caller.buyer_name}}</span>
                                        </div>
                                        <div>{{msg.reason.text}}</div>
                                        <div style="font-size: smaller;" v-html="msg.message"></div>
                                    </div>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Recent Service Requests" v-if="serviceRequests">
                            <f7-accordion-content>
                                <f7-block>
                                    <div v-for="(sr, index) in serviceRequests" :key="index" class="message" :class="{'pz-bg-gray-lightest': index%2==0}">
                                        <div style="display: flex; justify-content: space-between; font-size: smaller; font-weight: bold;">
                                            <span>{{sr.created_date | dateFormat}}</span>
                                            <span>{{$pzGlobalReactiveData.serviceReqMap[sr.status]}}</span>
                                        </div>
                                        <div>{{sr.reasonMaster.text}}</div>
                                        <div style="font-size: smaller;" v-html="sr.description"></div>
                                    </div>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="Publisher Wise Sales (last 1 year)" v-if="publisherSales">
                            <f7-accordion-content>
                                <f7-block>
                                    <span class="color-gray pz-size-small">Only latest 10 results are shown</span>
                                    <div v-for="(o, index) in publisherSales" :key="index" class="message" :class="{'pz-bg-gray-lightest': index%2==0}">
                                        <div style="display: flex; justify-content: space-between; font-size: smaller; font-weight: bold;">
                                            <span>₹ {{o.sales_value | moneyFormat}}</span>
                                            <span>{{o.quantity}} books</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; font-size: smaller;">
                                            <span>{{o.publisher.name}}</span>
                                            <span>({{o.publisher.code}})</span>
                                        </div>
                                    </div>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>

                        <f7-list-item accordion-item title="View Orders" @click="openOrders()">
                            <f7-accordion-content />
                        </f7-list-item>

                    </f7-list>
                </section>

            </f7-page-content>
            <f7-page-content tab id="tab-2">Under construction...</f7-page-content>
        </f7-tabs>

    </f7-page>
</template>

<style scoped>
.message {
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 5px;
    max-width: 100%;
    border: 1px solid #F5F5F5;
}
</style>

<script>
import ListItem from '../shared/ListItem';

export default {
    name: 'CommunicationPanel',
    data() {
        return {
            users: null,
            userID: null,
            errMsg: null,
            autocompleteRef: null,
            userDetails: null,
            returnDetails: null,
            lastPaymentDetails: null,
            chqBounceDetails: null,
            businessDetails: null,
            userDiscountDetails: null,
            buyerConversations: null,
            serviceRequests: null,
            publisherSales: null
        };
    },
    computed: {
        totalOrderValue() {
            if (!this.businessDetails || !this.businessDetails.length) return null;
            else return this.businessDetails.reduce((sum, _) => sum + _.finalOrderValue, 0);
        },
        avgOrderValue() {
            if (!this.businessDetails || !this.businessDetails.length || !this.totalOrderValue) return null;
            else return this.totalOrderValue / this.businessDetails.length;
        },
        registeredAddr() {
            if (!this.userDetails) return null;
            else {
                const address = this.userDetails.userAddress.find(_ => _.address_type === 1);
                return address || null;
            }
        },
        shippingAddr() {
            if (!this.userDetails) return null;
            else {
                const shipAddress = this.userDetails.userAddress.find(_ => _.address_type === 2);
                const regAddress = this.userDetails.userAddress.find(_ => _.address_type === 1);
                if (shipAddress) return shipAddress;
                else if (regAddress) return regAddress;
                else return null;
            }
        }
    },
    components: {
        'list-item': ListItem
    },
    methods: {
        clearBuyerData() {
            this.userID = null;
            this.userDetails = null;
            this.returnDetails = null;
            this.lastPaymentDetails = null;
            this.chqBounceDetails = null;
            this.businessDetails = null;
            this.userDiscountDetails = null;
            this.buyerConversations = null;
            this.serviceRequests = null;
            this.publisherSales = null;
        },
        getAllUsers() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/list?type=2')
                .then(res => {
                    if (res.ok) {
                        this.users = res.body;
                        this.setUserSelection();
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        setUserSelection() {
            let that = this; // save a ref to this to use inside callbacks
            this.autocompleteRef = window.vm.$f7.autocomplete({
                openIn: 'popup', //open in popup
                opener: window.vm.Dom7('#autocomplete-standalone-popup-2'), //link that opens autocomplete
                backOnSelect: true, //go back after we select something
                textProperty: 'name',
                autoFocus: true,
                valueProperty: 'id',
                source(autocomplete, query, render) {
                    if (query.length < 3) return;
                    let results = [];
                    if (query && query.length === 0) {
                        render(results);
                        return;
                    }
                    // Find matched items
                    for (var i = 0; i < that.users.length; i++) {
                        if (that.users[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(that.users[i]);
                    }
                    // Render items by passing array with result items
                    render(results);
                },
                onChange(autocomplete, value) {
                    // Add item text value to item-after
                    window.vm.Dom7('#autocomplete-standalone-popup-2').find('.item-after').text(value[0].name);
                    // Add item value to input value and clear existing data
                    that.clearBuyerData();
                    that.userID = value[0].id;
                    // unlock swipes now that we are fetching data
                    window.Dom7('.swiper-container')[0].swiper.unlockSwipes();
                    // fetch data
                    that.getUserDetails();
                },
                onClose() {
                    window.f7.params.hideNavbarOnPageScroll = true;
                }
            });
        },
        openUserSelection() {
            window.f7.params.hideNavbarOnPageScroll = false;
            this.autocompleteRef.open();
        },
        getReturnsData() {
            window.vm.$http.get(window._pz.apiEndPt + 'returns?user=' + this.userID)
                .then(res => {
                    if (res.ok) this.returnDetails = res.body;
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getPaymentsData() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/payments/' + this.userID)
                .then(res => {
                    if (res.ok) this.lastPaymentDetails = res.body.length && res.body[0];
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getChqBounceData() {
            window.vm.$http.get(window._pz.apiEndPt + 'payments/cheque_bounce?user=' + this.userID)
                .then(res => {
                    if (res.ok) this.chqBounceDetails = res.body;
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getBusinessData() {
            window.vm.$http.get(window._pz.apiEndPt + 'orders?userId=' + this.userID)
                .then(res => {
                    if (res.ok) this.businessDetails = res.body;
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getUserDiscountDetails() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/discounts/' + this.userID)
                .then(res => {
                    if (res.ok) this.userDiscountDetails = res.body;
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getBuyerConversations() {
            window.vm.$http.get(window._pz.apiEndPt + 'communication/' + this.userID)
                .then(res => {
                    if (res.ok) this.buyerConversations = res.body.slice(0, 10);
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getServiceRequests() {
            window.vm.$http.get(window._pz.apiEndPt + 'sr?user=' + this.userID)
                .then(res => {
                    if (res.ok) this.serviceRequests = res.body;
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getPublisherSales() {
            const toDate = window.vm.moment().format('YYYY-MM-DD');
            const startDate = window.vm.moment().subtract(1, 'y').format('YYYY-MM-DD');

            window.vm.$http.get(`${window._pz.apiEndPt}reporting/sales/buyer_wise_publisher_wise?user=${this.userID}&startDate=${startDate}&toDate=${toDate}`)
                .then(res => {
                    if (res.ok) this.publisherSales = res.body.slice(0, 10);
                    else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        getUserDetails() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/' + this.userID)
                .then(res => {
                    if (res.ok) {
                        this.userDetails = res.body;
                        this.getReturnsData();
                        this.getPaymentsData();
                        this.getChqBounceData();
                        this.getBusinessData();
                        this.getUserDiscountDetails();
                        this.getBuyerConversations();
                        this.getServiceRequests();
                        this.getPublisherSales();
                    } else window._pz.errFunc(res);
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        openOrders() {
            allOrdersFilters.search[1].value = this.userID;
            console.log('allOrdersFilters: ', allOrdersFilters);
            window.vm.$f7.mainView.router.load({
                url: 'allorders',
                context: {
                    comps: allOrdersFilters
                }
            });
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.getAllUsers();
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() {
        console.debug(this.$options.name + ' mounted');
        setTimeout(function() {
            window.Dom7('.swiper-container')[0].swiper.lockSwipes();
        });
    },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};

const allOrdersFilters = {
    date: [
        {
            placeholder: 'Chose date range',
            value: null
        }
    ],
    singleselect: [
        {
            placeholder: 'Chose status',
            value: null,
            opts: [
                { label: 'All', value: null },
                { label: 'Received', value: '101' },
                { label: 'Confirmed', value: '102' },
                { label: 'Being Procured', value: '103' },
                { label: 'Being Packed', value: '104' },
                { label: 'Partially Dispatched', value: '105' },
                { label: 'Fully Dispatched', value: '114' },
                { label: 'Fulfilled', value: '106' },
                { label: 'Cancelled', value: '107' }
            ]
        }
    ],
    search: [
        {
            placeholder: 'Order ID:'
        },
        {
            placeholder: 'User ID:'
        }
    ]
};
</script>
