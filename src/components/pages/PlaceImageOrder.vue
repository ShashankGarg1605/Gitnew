<template>
    <f7-page name="PlaceImageOrder">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Place Image Order
            </f7-nav-center>
        </f7-navbar>

        <user-select :value.sync="userID" />

        <section v-if="userID" style="width: 80%;margin: 0px auto;">
            <image-uploader :maxCount="5" :submitLabel="'Place Image Order'" :inputTitles="true" :tooltip="true" @upload="uploadImage($event)" />
        </section>

        <div class="color-gray pz-page-err" v-if="errMsg && !$pzGlobalReactiveData.pendingReq">{{errMsg}}</div>

    </f7-page>
</template>

<script>
import ImageUploader from '../shared/ImageUploader';
import UserSelect from "../shared/UserSelect";

export default {
    name: 'PlaceImageOrder',
    data() {
        return {
            userID: null,
            errMsg: null,
            autocompleteRef: null,
            images: []
        };
    },
    components: {
        'image-uploader': ImageUploader,
        "user-select": UserSelect
    },
    methods: {
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
                        window.vm.$f7.addNotification({ message: `Image order ID ${res.body.id} placed!`, hold: 5000 });
                        let prevPage = window.vm.$f7.mainView.history[window.vm.$f7.mainView.history.length - 2];
                        window.vm.$f7.mainView.router.load({
                            url: prevPage,
                            reload: true
                        });
                    }
                })
                .catch(err => {
                    window.vm.$f7.hidePreloader();
                    window._pz.errFunc2.call(this, err);
                });

        }
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
