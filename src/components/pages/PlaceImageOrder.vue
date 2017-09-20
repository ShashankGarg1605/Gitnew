<template>
    <f7-page name="PlaceImageOrder">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Place Image Order
            </f7-nav-center>
        </f7-navbar>

        <section v-if="users">
            <div class="list-block pz-margin-top0">
                <a href="#" id="autocomplete-standalone-popup-2" class="item-link item-content autocomplete-opener" @click="openUserSelection()">
                    <input type="hidden" v-model="userID">
                    <div class="item-inner">
                        <div class="item-title" v-if="!userID">Select User</div>
                        <div class="item-after" :class="{'pz-max-width100': userID, 'pz-width100': userID}"></div>
                    </div>
                </a>
            </div>
        </section>

        <section v-if="users && userID" style="width: 80%;margin: 0px auto;">
            <image-uploader :maxCount="5" :submitLabel="'Place Image Order'" :inputTitles="true" :tooltip="true" @upload="uploadImage($event)" />
        </section>

        <div class="color-gray pz-page-err" v-if="!users && !$pendingReq">{{errMsg}}</div>

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
import ImageUploader from '../shared/ImageUploader';

export default {
    name: 'PlaceImageOrder',
    data() {
        return {
            users: null,
            userID: null,
            errMsg: null,
            autocompleteRef: null,
            images: []
        };
    },
    components: {
        'image-uploader': ImageUploader
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
                opener: window.vm.Dom7('#autocomplete-standalone-popup-2'), //link that opens autocomplete
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
                    window.vm.Dom7('#autocomplete-standalone-popup-2').find('.item-after').text(value[0].name);
                    // Add item value to input value
                    that.userID = value[0].id;
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
        uploadImage(images) {
            window.vm.$f7.showPreloader();

            let params = images.map(image => ({
                stringValue: image.data,
                name: image.title
            }));

            window.vm.$http.post(window._pz.apiEndPt + 'orders/image?user=' + this.userID, params)
                .then(res => {
                    window.vm.$f7.hidePreloader();
                    if (res.ok) {
                        window.vm.$f7.addNotification({ message: `Image order ID ${res.body.id} placed!`, hold: 3000 });
                        let prevPage = window.vm.$f7.mainView.history[window.vm.$f7.mainView.history.length - 2];
                        window.vm.$f7.mainView.router.load({
                            url: prevPage,
                            reload: true
                        });
                    }
                })
                .catch(err => {
                    window.vm.$f7.hidePreloader();
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
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
