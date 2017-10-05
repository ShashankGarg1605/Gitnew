<template>
    <section>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left" id="backBtn">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">User Detail</div>
            </div>
        </div>
        <f7-page name="UserDetail">
            <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="data">
                <list-item :label="'ID'" :value="data.id" />
                <list-item :label="'Status'" :value="$pzGlobalReactiveData.userStatusMap[data.status]" :grayback="true" />
                <list-item :label="'Buyer Type'" :value="data.buyerType" />
                <list-item :label="'Name'" :value="data.name" :grayback="true" />
                <list-item :label="'Owner Name'" :value="data.owner_name" />
                <list-item :label="'Mobile'" :grayback="true">
                    <a @click="$pzGlobalReactiveData.phone(data.mobile)">{{data.mobile}}</a>
                </list-item>
                <list-item :label="'2nd Mobile'">
                    <a @click="$pzGlobalReactiveData.phone(data.alternate_mobile)">{{data.alternate_mobile}}</a>
                </list-item>
                <list-item :label="'Email'" :value="data.email" :grayback="true" />
                <list-item :label="'User Type'" :value="$pzGlobalReactiveData.userTypeMap[data.user_type]" />
                <list-item :label="'Business Type'" :value="$pzGlobalReactiveData.businessTypeMap[data.business_type]" :grayback="true" />
                <list-item :label="'GSTIN'" :value="data.gstin" />
                <list-item :label="'PAN'" :value="data.pan_number" :grayback="true" />
                <list-item :label="'CIN'" :value="data.cin_number" />
                <list-item :label="'Shop License No'" :value="data.shop_licence_number" :grayback="true" />
                <list-item :label="'Registration No'" :value="data.registration_number" />
                <list-item :label="'Logistics Borne By'" :value="$pzGlobalReactiveData.logisticStatusMap[data.logistic_status]" :grayback="true" />
                <list-item :label="'Default Carrier'" :value="data.carrier_info && data.carrier_info.carrier.name" />
                <list-item :label="'Device Manufacturer'" :value="data.device_manufacturer" :grayback="true" />
                <list-item :label="'Operating System'" :value="data.operating_system" />
                <list-item :label="'Account Type'" :value="$pzGlobalReactiveData.accountTypeMap[data.account_type]" :grayback="true" />
                <list-item :label="'Bilty Requirements'" :value="$pzGlobalReactiveData.biltyReqMap[data.billt_requirement_code]" />
                <list-item :label="'Credit Period'" :value="data.credit_period" :grayback="true" />
                <list-item :label="'Credit Limit'" :value="data.credit_limit" />
                <list-item :label="'Last App Use'" :value="data.last_app_use" :grayback="true" />
                <list-item :label="'Registered Address'" :value="registeredAddr" />
                <list-item :label="'Shipping Address'" :value="shippingAddr" :grayback="true" />
                <list-item :label="'PAN Image'" v-if="panImage">
                    <img :src="panImage" class="pz-margin-r8 image" @click="$pzGlobalReactiveData.openZoomView(panImage)">
                </list-item>
                <list-item :label="'CIN Image'" v-if="cinImage" :grayback="true">
                    <img :src="cinImage" class="pz-margin-r8 image" @click="$pzGlobalReactiveData.openZoomView(cinImage)">
                </list-item>
                <list-item :label="'Shop License Image'" v-if="shopLicenseImage">
                    <img :src="shopLicenseImage" class="pz-margin-r8 image" @click="$pzGlobalReactiveData.openZoomView(shopLicenseImage)">
                </list-item>
            </section>

            <div class="color-gray pz-page-err" v-if="!data && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>
        </f7-page>
    </section>
</template>
<script>
import ListItem from '../shared/ListItem';

export default {
    name: 'UserDetail',
    data() {
        return {
            data: null,
            id: null,
            errMsg: null
        };
    },
    components: {
        'list-item': ListItem
    },
    computed: {
        registeredAddr() {
            if (!this.data) return null;
            else {
                const address = this.data.userAddress.find(_ => _.address_type === 1);
                return address && address.address;
            }
        },
        shippingAddr() {
            if (!this.data) return null;
            else {
                const shipAddress = this.data.userAddress.find(_ => _.address_type === 2);
                const regAddress = this.data.userAddress.find(_ => _.address_type === 1);
                if (shipAddress) return shipAddress.address;
                else if (regAddress) return regAddress.address;
                else return null;
            }
        },
        panImage() {
            if (!this.data || !this.data.pan_image) return null;
            else return window._pz.uploadsEndPt + 'userdocs/pan/' + this.data.pan_image;
        },
        cinImage() {
            if (!this.data || !this.data.cin_image) return null;
            else return window._pz.uploadsEndPt + 'userdocs/cin/' + this.data.cin_image;
        },
        shopLicenseImage() {
            if (!this.data || !this.data.shop_licence_image) return null;
            else return window._pz.uploadsEndPt + 'userdocs/shopLicense/' + this.data.shop_licence_image;
        }
    },
    methods: {
        getDetails() {
            window.vm.$http.get(`${window._pz.apiEndPt}users/${this.id}`)
                .then(res => {
                    if (res.ok) {
                        this.data = res.body;
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
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
