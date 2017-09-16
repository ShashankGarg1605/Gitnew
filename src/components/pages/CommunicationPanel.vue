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
                    <a href="#" id="autocomplete-standalone-popup" class="item-link item-content autocomplete-opener" @click="openUserSelection()">
                        <input type="hidden" id="usersearch" v-model="userID">
                        <div class="item-inner">
                            <div class="item-title">Select User</div>
                            <div class="item-after"></div>
                        </div>
                    </a>
                </div>
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
                    if (err instanceof Error) throw new Error(err);
                    this.errMsg = window._pz.errFunc(err);
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
                    window.Dom7('.swiper-container')[0].swiper.unlockSwipes();
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
        getAllData() {

        },
        getUserDetails() {
            window.vm.$http.get(window._pz.apiEndPt + 'users/' + this.userID)
                .then(res => {
                    console.log('res: ', res);
                    if (res.ok) {
                        this.userDetails = res.body;
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
