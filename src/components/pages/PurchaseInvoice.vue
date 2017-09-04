<template>
    <f7-page name="PurchaseInvoice" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

        <f7-navbar sliding>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Purchase Invoice
            </f7-nav-center>
        </f7-navbar>

        <div style="overflow: hidden; margin: 16px 16px 16px;">
            <a href="#" class="button button-fill button-raised pz-flex-c-c pz-float-r" @click="openFilters()">
                <icon name="filter"></icon>
                <span class="pz-padding-l16">Filter</span>
            </a>
        </div>

        <!-- <span style="font-size: xx-small;">{{filters}}</span> -->

        <f7-list class="pz-margin-top0">
            <div v-if="allInvoice.length">
                <ul>
                    <li class="item-content" v-for="invoice in allInvoice" :key="invoice.id">
                        <div class="item-inner" style="flex-direction: column;">
                            <div class="row pz-width100">
                                <div class="col-25 color-gray">#{{invoice.invoice_number}}</div>
                                <div class="col-75 ">Rs. {{invoice.value | moneyFormat}} </div>
                            </div>
                            <div class="row pz-width100">
                                <div class="col-25 color-gray pz-weight-thin ">Supplier:</div>
                                <div class="col-75 ">{{invoice.publisher ? invoice.publisher.name : invoice.distributors.distributor_name}}</div>
                            </div>
                            <div class=" row pz-width100 ">
                                <div class="col-25 color-gray pz-weight-thin ">Date:</div>
                                <div class="col-75 ">{{moment(invoice.invoice_date, 'DD-MM-YYYY hh:mm').format('ddd, Do MMM YYYY')}}</div>
                            </div>
                            <div class="row pz-width100 ">
                                <div class="col-25 color-gray pz-weight-thin ">Qty:</div>
                                <div class="col-75 ">{{invoice.total_books}} book(s)</div>
                            </div>
                            <i class="f7-icons pz-popover " @click='openPopover(invoice.id, $event)'>more_horiz</i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="color-gray list-block pz-size-smaller " style="text-align: center; font-style: italic; " v-if="allInvoice.length && hasReachedEnd && !pendingReq ">Thats all folks!</div>
            <div class="color-gray list-block pz-size-smaller " style="text-align: center; font-style: italic; " v-if="!allInvoice.length && !pendingReq ">No results found</div>
        </f7-list>

        <f7-popover id="pz-popover-2">
            <div class="popover-inner ">
                <div class="list-block ">
                    <a @click="openPage( 'orderdetail') " class="list-button item-link close-popover ">View Details</a>
                    <a @click="openPage( 'orderupdate') " class="list-button item-link close-popover ">Update Order</a>
                </div>
            </div>
        </f7-popover>

    </f7-page>
</template>

<style scoped>
.pz-popover {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 10px;
}
</style>

<script>
export default {
    name: 'PurchaseInvoice',
    data() {
        return {
            allInvoice: [],
            limit: 20,
            offset: 0,
            pendingReq: false,
            hasReachedEnd: false,
            filters: {
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
                            {
                                label: 'Open',
                                value: 0
                            },
                            {
                                label: 'Closed',
                                value: 1
                            },
                            {
                                label: 'Both',
                                value: null
                            }
                        ]
                    }
                ],
                search: [
                    {
                        placeholder: 'Supplier: '
                    },
                    {
                        placeholder: 'Invoice no:'
                    }
                ]
            }
        };
    },
    methods: {
        getAllOrders(filterQuery) {
            this.pendingReq = true;

            let url = `http://staging.prozo.com/api/v3/purchase_invoice?limit=${this.limit}&offset=${this.offset}&orderBy=invoice_date&orderByValue=desc` + filterQuery;
            window.vm.$http.get(url)
                .then(res => {
                    this.allInvoice = this.allInvoice.concat(res.body);
                    this.offset += res.body.length;
                    this.pendingReq = false;

                    if (this.offset % this.limit !== 0) {
                        this.removeInfiniteScroll();
                    }
                })
                .catch((err) => {
                    if (err instanceof Error) throw new Error(err);

                    this.pendingReq = false;
                    this.removeInfiniteScroll();
                });
        },
        onInfiniteScroll() {
            console.log('onInfiniteScroll');
            if (this.offset % this.limit === 0 && !this.pendingReq) this.getAllOrders();
        },
        onPullToRefresh() {
            window.vm.$f7.mainView.router.refreshPage();
        },
        openPage(pageName) {
            let id = window.Dom7('#pz-popover').data('pz-id');
            window.vm.$f7.mainView.router.load({
                url: pageName,
                context: { id: id }
            });
        },
        openPopover(id, e) {
            window.vm.$f7.popover(window.Dom7('#pz-popover-2'), e.target);
            window.Dom7('#pz-popover-2').data('pz-id', id);
        },
        // reset the infinite scroll behaviour, as on previous page, we may have reached the end of ITS scroll
        addInfiniteScroll() {
            window.vm.$f7.attachInfiniteScroll(window.Dom7('.infinite-scroll'));
            window.Dom7('.infinite-scroll-preloader').show();
            this.hasReachedEnd = false;
        },
        removeInfiniteScroll() {
            window.vm.$f7.detachInfiniteScroll(window.Dom7('.infinite-scroll'));
            window.Dom7('.infinite-scroll-preloader').hide();
            this.hasReachedEnd = true;
        },
        openFilters() {
            window.vm.$f7.mainView.router.load({
                url: 'filters',
                // send over a clone of the filters object to avoid mutating it directly from the filters page
                context: { comps: JSON.parse(JSON.stringify(this.filters)) }
            });
        }
    },
    filters: {
        moneyFormat(data) {
            if (!data) return '';
            data = parseInt(data);
            data = data.toString();
            let lastThree = data.substring(data.length - 3);
            let otherNumbers = data.substring(0, data.length - 3);
            if (otherNumbers !== '') lastThree = ',' + lastThree;
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');

        // 1. if we come here from the filters page, replace the default filters with the updated filters
        let filters = this.$route.options.context && this.$route.options.context.comps;
        if (filters) this.filters = filters;


        // 2. build the filter query
        let filterQuery = '';

        // a. single select
        let { value: status = null } = this.filters.singleselect[0];
        if (status !== null) filterQuery += `&status=${status}`;

        // b. date range
        let { value: dateRange = null } = this.filters.date[0];
        if (dateRange !== null) filterQuery += '&startDate=' + window.vm.moment(dateRange[0]).format('YYYY-MM-DD');
        if (dateRange !== null && dateRange.length > 1) filterQuery += '&endDate=' + window.vm.moment(dateRange[1]).format('YYYY-MM-DD');

        // c. supplier search
        let { value: supplier = null } = this.filters.search[0];
        if (supplier !== null) filterQuery += `&supplier=${supplier}`;

        // d. invoice number search
        let { value: invoiceNumber = null } = this.filters.search[1];
        if (invoiceNumber !== null) filterQuery += `&invoice_number=${invoiceNumber}`;

        this.getAllOrders(filterQuery);

    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
