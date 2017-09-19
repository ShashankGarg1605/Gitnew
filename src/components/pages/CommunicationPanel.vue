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
            <a href="#" data-tab="#tab-3" class="tab-link" :disabled="!userID">Last 20 orders</a>
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

                <section v-if="userID && userDetails">

                    <f7-list accordion>
                        <f7-list-item accordion-item title="Basic Details">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Name'" :value="userDetails.buyer_name" />
                                    <list-item :grayback="true" :label="'Owner Name'" :value="userDetails.owner_name" />
                                    <list-item :label="'Location'" :value="'???'" />
                                    <list-item :grayback="true" :label="'Account since'" :value="userDetails.created_date" />
                                    <list-item :label="'Number'" :value="userDetails.mobile" />
                                    <list-item :grayback="true" :label="'2nd Number'" :value="userDetails.alternate_mobile" />
                                    <list-item :label="'Type'" :value="userDetails.buyerType" />
                                    <list-item :grayback="true" :label="'Email'" :value="userDetails.email" />
                                    <list-item :label="'Last app use'" :value="userDetails.last_app_use" />
                                    <list-item :grayback="true" :label="'Account type'" :value="userDetails.account_type" />
                                    <list-item :label="'Account opening form'" :value="userDetails.account_opening_form" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>
                        <f7-list-item accordion-item title="Profile summary">
                            <f7-accordion-content>
                                <f7-block>
                                    <p class="pz-bg-gray-lighter">{{userDetails.profile_summary || '(Not available)'}}</p>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>
                        <f7-list-item accordion-item title="Relationship Manager Details">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Mgr name'" :value="userDetails.rm_name" />
                                    <list-item :grayback="true" :label="'Mgr mobile'" :value="userDetails.rm_mobile" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>
                        <f7-list-item accordion-item title="Logistics Details">
                            <f7-accordion-content>
                                <f7-block>
                                    <list-item :label="'Goods carrier'" :value="userDetails.carrier_info && userDetails.carrier_info.carrier && userDetails.carrier_info.carrier.name" />
                                    <list-item :grayback="true" :label="'Carrier mobile'" :value="userDetails.carrier_info && userDetails.carrier_info.carrier && userDetails.carrier_info.carrier.mobile" />
                                    <list-item :label="'Avg duration of goods delivery'" :value="userDetails.carrier_info && userDetails.carrier_info.transporting_days" />
                                    <list-item :grayback="true" :label="'Logistics paid for by'" :value="'???'" />
                                    <list-item :label="'Bilty Requirements'" :value="userDetails.billty_code" />
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>
                        <f7-list-item accordion-item title="Buyer Addresses">
                            <f7-accordion-content>
                                <f7-block>
                                    <div v-if="userDetails.userAddress && userDetails.userAddress.length" style="border: 1px dashed lightgrey;">
                                        <list-item :label="'Address type'" :value="userDetails.userAddress[0].address_type==1?'Registered':'Shipping' " />
                                        <list-item :grayback="true" :label="'Name'" :value="userDetails.userAddress[0].name" />
                                        <list-item :label="'Address'" :value="userDetails.userAddress[0].address" />
                                        <list-item :grayback="true" :label="'Landmark'" :value="userDetails.userAddress[0].landmark" />
                                        <list-item :label="'City (state)'" :value="userDetails.userAddress[0].city.name + ' (' + userDetails.userAddress[0].city.state.name + ')'" />
                                    </div>
                                    <div v-if="userDetails.userAddress && userDetails.userAddress.length>1" style="border: 1px dashed lightgrey;    margin-top: 8px;">
                                        <list-item :label="'Address type'" :value="userDetails.userAddress[1].address_type==1?'Registered':'Shipping' " />
                                        <list-item :grayback="true" :label="'Name'" :value="userDetails.userAddress[1].name" />
                                        <list-item :label="'Address'" :value="userDetails.userAddress[1].address" />
                                        <list-item :grayback="true" :label="'Landmark'" :value="userDetails.userAddress[1].landmark" />
                                        <list-item :label="'City (state)'" :value="userDetails.userAddress[1].city.name + ' (' + userDetails.userAddress[1].city.state.name + ')'" />
                                    </div>
                                </f7-block>
                            </f7-accordion-content>
                        </f7-list-item>
                    </f7-list>
                </section>

            </f7-page-content>
            <f7-page-content tab id="tab-2">Tab 2 Content ...</f7-page-content>
            <f7-page-content tab id="tab-3">Tab 3 Content ...</f7-page-content>
        </f7-tabs>

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
</style>

<script>
var listItem = {
    template: `<div class="row pz-padding-tb-4" v-bind:class="{ 'pz-bg-gray-lightest': grayback}">
                <span class="col-35 color-gray pz-weight-thin ">{{label}}:</span>
                <span class="col-65 ">{{value}}</span>
            </div>`,
    props: {
        label: String,
        value: {
            default: '(Not available)'
        },
        grayback: Boolean
    }
};

export default {
    name: 'CommunicationPanel',
    data() {
        return {
            users: null,
            userID: null,
            errMsg: null,
            autocompleteRef: null,
            userDetails: null
        };
    },
    components: {
        'list-item': listItem
    },
    methods: {
        clearBuyerData() {
            this.userID = null;
            this.userDetails = null;
        },
        getAllUsers() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/list?type=2')
                .then(res => {
                    console.log('res: ', res);
                    if (res.ok) {
                        this.users = res.body;
                        this.setUserSelection();
                    }
                })
                .catch(err => {
                    if (err instanceof Error) throw new Error(err);
                    this.errMsg = window._pz.errFunc(err);
                });
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
        getAllOtherData() {

        },
        getUserDetails() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/' + this.userID)
                .then(res => {
                    if (res.ok) {
                        this.userDetails = res.body;
                        this.getAllOtherData();
                    } else window._pz.errFunc(res);
                })
                .catch(err => {
                    if (err instanceof Error) throw new Error(err);
                    this.errMsg = window._pz.errFunc(err);
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
</script>
