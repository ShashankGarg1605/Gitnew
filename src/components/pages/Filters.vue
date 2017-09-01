<template>
    <f7-page name="Filters">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Filters
            </f7-nav-center>
        </f7-navbar>
        <div class="content-block-title">Select a filter</div>
        <span style="font-size: xx-small;">{{comps}}</span>
        <div class="list-block">
            <ul>
                <pz-filter-date-range v-model="comp.value" v-for="(comp, index) in comps.date" :key="index" :placeholder="comp.placeholder"></pz-filter-date-range>
                <pz-filter-single-select v-model="comp.value" v-for="(comp, index) in comps.singleselect" :key="index" :placeholder="comp.placeholder" :opts="comp.opts"></pz-filter-single-select>

            </ul>
        </div>

        <div class="bottom">
            <a href="#" class="button color-green pz-margin-r16 pz-padding-lr32">Reset</a>
            <a href="#" class="button button-fill button-raised color-teal pz-margin-r16 pz-padding-lr32" @click="applyFilters()">Apply</a>
        </div>

    </f7-page>
</template>

<style scoped>
#date::placeholder {
    color: inherit;
}

.bottom {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 65px;
    align-items: center;
    box-shadow: 0px 0px 1px 3px lightgrey;
}
</style>


<script>
export default {
    name: 'Filters',
    data() {
        return {
            comps: null
        };
    },
    methods: {
        applyFilters() {
            console.log('this.comps: ', this.comps);
            var prevPage = window.vm.$f7.mainView.history[window.vm.$f7.mainView.history.length - 2];
            console.log('prevPage: ', prevPage);
            window.vm.$f7.mainView.router.load({
                url: prevPage,
                reload: true,
                context: { comps: this.comps }
            });
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.comps = this.$route.options.context && this.$route.options.context.comps;
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
