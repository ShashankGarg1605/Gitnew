<template>
    <f7-page name="CommunicationPanel">

        <f7-navbar sliding>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                Communication Panel
            </f7-nav-center>
        </f7-navbar>

        <section v-if="users">
            <div class="list-block pz-margin-top0">
                <a href="#" id="autocomplete-standalone-popup" class="item-link item-content autocomplete-opener" @click="openUserSelection()">
                    <input type="hidden" id="usersearch" v-model="userID">
                    <div class="item-inner">
                        <div class="item-title">Select User</div>
                        <div class="item-after"></div>
                    </div>
                </a>
            </div>
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
</style>

<script>
export default {
    name: 'CommunicationPanel',
    data() {
        return {
            users: null,
            userID: null,
            pendingReq: false,
            errMsg: null,
            autocompleteRef: null
        };
    },
    methods: {
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
                    console.log('err: ', err);

                });
        },
        setUserSelection() {
            let that = this; // save a ref to this to use inside callbacks
            this.autocompleteRef = window.vm.$f7.autocomplete({
                openIn: 'popup', //open in popup
                opener: window.vm.Dom7('#autocomplete-standalone-popup'), //link that opens autocomplete
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
                    window.vm.Dom7('#autocomplete-standalone-popup').find('.item-after').text(value[0].name);
                    // Add item value to input value
                    that.userID = value[0].id;
                }
            });
        },
        openUserSelection() {
            this.autocompleteRef.open();
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.getAllUsers();
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
