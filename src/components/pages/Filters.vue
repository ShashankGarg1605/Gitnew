<template>
    <f7-page name="OrderUpdate">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Filters
            </f7-nav-center>
        </f7-navbar>
        <div class="content-block-title">Select a filter</div>
        <div class="list-block">
            <ul>
                <pz-filter-date-range v-model="item"></pz-filter-date-range>
                <!-- <pz-filter-date-range v-bind:item="item" v-model="item"></pz-filter-date-range> -->

                <!-- <li class="item-content button pz-colr-inherit pz-cap">
                                                <div class="item-media">
                                                    <icon name="pencil-square-o"></icon>
                                                </div>
                                                <div class="item-inner pz-margin-l0">
                                                    <div class="item-title">Search supplier</div>
                                                    <div class="item-after">
                                                        <span>
                                                            <icon name="chevron-right"></icon>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>

                                            <li class="item-content button pz-colr-inherit pz-cap">
                                                <div class="item-media">
                                                    <icon name="pencil-square-o"></icon>
                                                </div>
                                                <div class="item-inner pz-margin-l0">
                                                    <div class="item-title">Search invoice number</div>
                                                    <div class="item-after">
                                                        <span>
                                                            <icon name="chevron-right"></icon>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>

                                            <li class="item-content button pz-colr-inherit pz-cap">
                                                <div class="item-media">
                                                    <icon name="sliders"></icon>
                                                </div>
                                                <div class="item-inner pz-margin-l0">
                                                    <div class="item-title">Set price range</div>
                                                    <div class="item-after">
                                                        <span>
                                                            <icon name="chevron-right"></icon>
                                                        </span>
                                                    </div>
                                                </div>
                                            </li> -->

            </ul>
        </div>

    </f7-page>
</template>

<style scoped>
#date::placeholder {
    color: inherit;
}
</style>


<script>
window.pz_filters = {
    name: 'Filters',
    data() {
        return {
            comps: null
        };
    },
    created() {
        console.log('Filters created');
        this.comps = this.$route.options.context && this.$route.options.context.comps;
    },
    mounted() {
        window.cal = window.f7.calendar({ input: '#date', rangePicker: true, toolbarCloseText: 'apply' });
    }
};
export default window.pz_filters;
</script>
