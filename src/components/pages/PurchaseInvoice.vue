<template>
    <f7-page name="PurchaseInvoice" infinite-scroll @infinite="onInfiniteScroll" pull-to-refresh @ptr:refresh="onPullToRefresh">

        <f7-navbar>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Purchase Invoice
            </f7-nav-center>
        </f7-navbar>

        <div class="pz-padding-16 pz-float-l color-gray" v-if="totalCount">
            Found {{totalCount}} results
        </div>

        <div style="overflow: hidden; margin: 16px 16px 16px;">
            <a href="#" class="button button-fill button-raised pz-flex-c-c pz-float-r" @click="openFilters()">
                <icon name="filter"></icon>
                <span class="pz-padding-l16">Filter</span>
            </a>
        </div>

        <f7-list>
            <div v-if="allInvoice.length" class="list-block">
                <ul>
                    <li class="item-content" v-for="invoice in allInvoice" :key="invoice.id" :class="{ redBg: !invoice.image }">
                        <div class="item-inner" style="flex-direction: column;">
                            <div class="row pz-width100">
                                <div class="col-30 color-gray">#{{invoice.invoice_number}}</div>
                                <div class="col-70 ">Rs. {{invoice.value | moneyFormat}} </div>
                            </div>
                            <div class="row pz-width100">
                                <div class="col-30 color-gray pz-weight-thin ">Supplier:</div>
                                <div class="col-70 ">{{invoice.publisher ? invoice.publisher.name : invoice.distributors.distributor_name}}</div>
                            </div>
                            <div class=" row pz-width100 ">
                                <div class="col-30 color-gray pz-weight-thin ">Date:</div>
                                <div class="col-70 ">{{moment(invoice.invoice_date, 'DD-MM-YYYY hh:mm').format('ddd, Do MMM YYYY')}}</div>
                            </div>
                            <div class="row pz-width100 ">
                                <div class="col-30 color-gray pz-weight-thin ">Qty:</div>
                                <div class="col-70 ">{{invoice.total_books}} book(s)</div>
                            </div>
                            <i v-if="invoice.image" class="f7-icons pz-popover " @click='openPopover(invoice.id, $event)'>more_horiz</i>
                            <span v-if="!invoice.image" @click="openPage( 'PurchaseInvoiceDetail', invoice.id)">
                                <icon class="pz-popover" name="cloud-upload" scale="1.5"></icon>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="color-gray" style="text-align: center; font-style: italic; " v-if="allInvoice.length && hasReachedEnd && !pendingReq ">Thats all folks!</div>
            <div class="color-gray" style="text-align: center; font-style: italic; " v-if="!allInvoice.length && !pendingReq ">No results found</div>
        </f7-list>

        <f7-popover id="pz-popover-2">
            <div class="popover-inner ">
                <div class="list-block ">
                    <a @click="openPage( 'PurchaseInvoiceDetail')" class="list-button item-link close-popover">View Details</a>
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

.redBg {
    background: #FFEBEE !important;
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
            totalCount: null,
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
                                label: 'Complete',
                                value: 1
                            },
                            {
                                label: 'Show both',
                                value: null
                            }
                        ]
                    },
                    {
                        placeholder: 'Whether invoice is uploaded',
                        value: null,
                        opts: [
                            {
                                label: 'Invoice uploaded',
                                value: 1
                            },
                            {
                                label: 'Invoice not uploaded',
                                value: 0
                            },
                            {
                                label: 'Show both',
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
    computed: {
        filterQuery() {
            let filterQuery = '';

            // a. single select
            let { value: status = null } = this.filters.singleselect[0];
            if (status !== null) filterQuery += `&status=${status}`;

            let { value: imageUploaded = null } = this.filters.singleselect[1];
            if (imageUploaded !== null) filterQuery += `&image_uploaded=${imageUploaded}`;

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

            return filterQuery;
        }
    },
    methods: {
        getAllInvoices() {
            this.pendingReq = true;

            let url = `${window._pz.apiEndPt}purchase_invoice?limit=${this.limit}&offset=${this.offset}&orderBy=invoice_date&orderByValue=desc` + this.filterQuery;
            window.vm.$http.get(url)
                .then(res => {
                    this.totalCount = res.headers.map.count && res.headers.map.count[0];
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
            if (this.offset % this.limit === 0 && !this.pendingReq) this.getAllInvoices();
        },
        onPullToRefresh() {
            window.vm.$f7.mainView.router.refreshPage();
        },
        openPage(pageName, id) {
            id = id || window.Dom7('#pz-popover-2').data('pz-id');
            // window.vm.$f7.mainView.router.load({
            //     url: pageName,
            //     context: { id: id }
            // });
            let url = `${pageName}?id=${id}`;
            window.vm.$f7.mainView.router.loadPage(url);
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
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');

        if (window._pz.checkNested(this, '$route', 'options', 'context', 'comps')) this.filters = this.$route.options.context.comps;
        this.getAllInvoices();
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
