<template>
    <f7-page name="OrderDetail" pull-to-refresh @ptr:refresh="onPullToRefresh">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Order Detail
            </f7-nav-center>
        </f7-navbar>

        <div class="color-gray pz-page-err" v-if="data">{{data}}</div>
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
