<template>
    <f7-page name="PlaceImageOrder">

        <f7-navbar sliding>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Place Image Order
            </f7-nav-center>
        </f7-navbar>

        <section class="pz-width100 pz-size-normal pz-padding-t16" v-if="users">
            users
        </section>

        <div class="color-gray pz-page-err" v-if="!users && !pendingReq">{{errMsg}}</div>

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
export default {
    name: 'PlaceImageOrder',
    data() {
        return {
            users: null,
            id: null,
            pendingReq: false,
            errMsg: null
        };
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() { console.debug(this.$options.name + ' created'); },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
