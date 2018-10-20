<template>
    <f7-page name="AssignOrder">
        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>AssignOrder</f7-nav-center>
        </f7-navbar>
        <div class="list-block pz-margin-top0">
            <a
                href="#"
                id="autocomplete-standalone-popup-2"
                class="item-link item-content autocomplete-opener"
                @click="openUserSelection()"
                :disabled="!users || !users.length"
            >
                <input type="hidden" v-model="selectedUser">
                <div class="item-inner">
                    <div class="item-title" v-if="!selectedUser">Select User</div>
                    <div
                        class="item-after"
                        :class="{'pz-max-width100': selectedUser, 'pz-width100': selectedUser}"
                    ></div>
                </div>
            </a>
        </div>
        <div
            class="color-gray pz-page-err"
            v-if="errMsg && !$pzGlobalReactiveData.pendingReq"
        >{{errMsg}}</div>
    </f7-page>
</template>

<style scoped>
</style>

<script>
export default {
    name: "AssignOrder",
    data() {
        return {
            users: null,
            selectedUser: null,
            errMsg: null,
            autocompleteRef: null,
            orderId: null
        };
    },
    methods: {
        getAllUsers() {
            window.vm.$http
                .get(window._pz.apiEndPt + "users/list?type=1")
                .then(res => {
                    console.log("res: ", res);
                    if (res.ok) {
                        this.users = res.body;
                        this.setUserSelection();
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
        },
        setUserSelection() {
            let that = this; // save a ref to this to use inside callbacks
            this.autocompleteRef = window.vm.$f7.autocomplete({
                openIn: "popup", //open in popup
                opener: window.vm.Dom7("#autocomplete-standalone-popup-2"), //link that opens autocomplete
                backOnSelect: true, //go back after we select something
                textProperty: "name",
                autoFocus: true,
                valueProperty: "id",
                source(autocomplete, query, render) {
                    if (!query || !query.length || query.length < 3) return;

                    query = query.toLowerCase();
                    const results = that.users.filter(user => user.name.toLowerCase().indexOf(query) !== -1);
                    render(results);
                },
                onChange: this.showSelectedValue.bind(that),
                onClose() {
                    window.f7.params.hideNavbarOnPageScroll = true;
                }
            });
        },
        openUserSelection() {
            if (!this.users) return this.getAllUsers();

            window.f7.params.hideNavbarOnPageScroll = false;
            this.autocompleteRef.open();
        },
        showSelectedValue(autocomplete, value) {
            // Add item text value to item-after
            window.vm
                .Dom7("#autocomplete-standalone-popup-2")
                .find(".item-after")
                .text(value[0].name);
            // Add item value to input value
            this.selectedUser = value[0];
            window.vm.$f7.confirm(`Do you want to assign order ${this.orderId} to ${this.selectedUser.name}`, this.assignOrder);
        },
        assignOrder() {
            window.vm.$http
                .patch(`${window._pz.apiEndPt}orders?updateType=verification&id=${this.orderId}&sortedBy=${this.selectedUser.id}`)
                .then(res => {
                    if (res.ok) {
                        window.vm.$f7.addNotification({
                            message: "Order assigned successfully!",
                            hold: 2000
                        });

                        window._pz.refreshOnBack = true;
                        window.vm.$f7.mainView.router.back();
                    }
                })
                .catch(window._pz.errFunc2.bind(this));
        }
    },
    beforeCreate() {
        console.debug(this.$options.name + " beforeCreate");
    },
    created() {
        console.debug(this.$options.name + " created");
        this.orderId = this.$route.query && this.$route.query.id;
        this.getAllUsers();
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

