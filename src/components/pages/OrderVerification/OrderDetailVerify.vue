<template>
    <f7-page name="OrderDetailVerify">
        <f7-navbar v-bind="$pzGlobalReactiveData.navHistory.length>1?{ 'back-link': 'back' }:''">
            <f7-nav-left v-if="$pzGlobalReactiveData.navHistory.length==1">
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center style="display: flex;align-items: center;">
                <span>Verify Order</span>
            </f7-nav-center>
        </f7-navbar>
        <!-- Scrollable page content-->
        <main>
            <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="orderData">
                <list-item :label="'Order ID'" :value="orderData.id" />
                <list-item :label="'City'" :value="city" />
                <list-item :label="'Total Books'" :value="nbTotalBooks" />
                <list-item :label="'Total Books'" :value="nbUniqueTitles" />
            </section>
        </main>
    </f7-page>
</template>

<style scoped>
</style>

<script>

import ListItem from "../../shared/ListItem";

export default {
    name: "OrderDetailVerify",
    components: {
        "list-item": ListItem
    },
    data() {
        return {
            title: "OrderDetailVerify",
            orderData: null
        };
    },
    computed: {
        city() {
            return window._pz.checkNested(this, "orderData", "user", "userAddress") ? this.orderData.user.userAddress.find(_ => _.address_type === 1).city.name : null;
        },
        nbTotalBooks() {
            return window._pz.checkNested(this, "orderData", "orderProduct") ? this.orderData.orderProduct.reduce((sum, book) => sum + book.quantity, 0) : null;
        },
        nbUniqueTitles() {
            return window._pz.checkNested(this, "orderData", "orderProduct") ? this.orderData.orderProduct.length : null;
        },
        verifiedPct() {
            if (!window._pz.checkNested(this, "orderData", "orderProduct")) return null;

            const verifiedQty = this.orderData.orderProduct.reduce((sum, book) => sum + book.verified_quantity, 0);
            return verifiedQty / this.nbUniqueTitles * 100;
        }
    },
    methods: {

    },
    beforeCreate() {
        console.debug(this.$options.name + " beforeCreate");
    },
    created() {
        console.debug(this.$options.name + " created");
        if (window._pz.checkNested(this, "$route", "options", "context", "orderData"))
            this.orderData = this.$route.options.context.orderData;
    },
    beforeMount() {
        console.debug(this.$options.name + " beforeMount");
    },
    mounted() {
        console.debug(this.$options.name + " mounted");
    },
    beforeUpdate() {
        console.debug(this.$options.name + " beforeUpdate");
    },
    updated() {
        console.debug(this.$options.name + " updated");
    },
    beforeDestroy() {
        console.debug(this.$options.name + " beforeDestroy");
    },
    destroyed() {
        console.debug(this.$options.name + " destroyed");
    }
};
</script>
