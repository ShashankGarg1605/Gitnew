<template>
    <div class="list-block pz-margin-top0">
        <a href="#" id="autocomplete-standalone-popup-2" class="item-link item-content autocomplete-opener" @click="openUserSelection()" :disabled="!users || !users.length">
            <input type="hidden" v-model="userID">
            <div class="item-inner">
                <div class="item-title" v-if="!userID">Select User</div>
                <div class="item-after" :class="{'pz-max-width100': userID, 'pz-width100': userID}"></div>
            </div>
        </a>
    </div>
</template>

<script>
export default {
    name: "UserSelect",
    data() {
        return {
            users: null,
            userID: null
        };
    },
    watch: {
        userID() {
            this.$emit('update:value', this.userID);
        }
    },
    methods: {
        getAllUsers() {
            window.vm.$http
                .get(window._pz.apiEndPt + "users/list?type=2")
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
                    window.vm
                        .Dom7("#autocomplete-standalone-popup-2")
                        .find(".item-after")
                        .text(value[0].name);
                    // Add item value to input value
                    that.userID = value[0].id;
                },
                onClose() {
                    window.f7.params.hideNavbarOnPageScroll = true;
                }
            });
        },
        openUserSelection() {
            if (!this.users) return this.getAllUsers();

            window.f7.params.hideNavbarOnPageScroll = false;
            this.autocompleteRef.open();
        }
    },
    beforeCreate() {
        console.debug(this.$options.name + " beforeCreate");
    },
    created() {
        console.debug(this.$options.name + " created");
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