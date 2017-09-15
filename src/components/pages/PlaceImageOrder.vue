<template>
    <f7-page name="PlaceImageOrder">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Place Image Order
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

        <section v-if="users && userID">
            <image-card @imageAdded="imageAdded($event)" @imageRemoved="imageRemoved($event)" :label="'Add an image'" />
            <image-card v-if="images.length>0" @imageAdded="imageAdded($event)" @imageRemoved="imageRemoved($event)" :label="'Add 2nd image (optional)'" />
            <image-card v-if="images.length>0" @imageAdded="imageAdded($event)" @imageRemoved="imageRemoved($event)" :label="'Add 3rd image (optional)'" />
            <image-card v-if="images.length>0" @imageAdded="imageAdded($event)" @imageRemoved="imageRemoved($event)" :label="'Add 4th image (optional)'" />
            <a href="#" v-if="images.length>0" class="button button-fill button-raised button-big color-teal pz-margin-8">Place order</a>
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
var imageCard = {
    template: `<div class="card facebook-card pz-margin-tb16">
                <input class="card-header pz-width100 pz-border-0" type="text" placeholder="Title (optional)" v-model="imgTitle" v-if="imgData">
                <div class="card-content">
                    <img v-if="imgData" :src="imgData" class="pz-width100">
                    <span v-if="!imgData" class="button color-black pz-bg-gray-lighter" @click="uploadChoices()">{{label}}</span>
                </div>
                <div class="card-footer no-border" v-if="imgData">
                    <a href="#" class="link" :disabled="!imgData" @click="removeImage()">Remove</a>
                    <a href="#" class="link" :disabled="!imgData" @click="uploadChoices()">Retake</a>
                </div>
            </div>`,
    props: ['label'],
    data() {
        return {
            imgData: null,
            // imgID: this.imageCount,
            imgID: Math.random().toString(36).substr(2, 10),
            imgTitle: null
        };
    },
    methods: {
        uploadChoices() {
            let buttons = [
                { text: 'Add image using', label: true },
                {
                    text: 'Camera',
                    onClick: function() { this.getImage('CAMERA'); }.bind(this)
                },
                {
                    text: 'Gallery',
                    onClick: function() { this.getImage('PHOTOLIBRARY'); }.bind(this)
                }
            ];
            window.vm.$f7.actions(buttons);
        },
        getImage(source) {
            if (!navigator.camera) {
                // xxx
                let res = window._pz.imgData;
                this.imgData = 'data:image/jpeg;base64,' + res;
                this.$emit('imageAdded', {
                    imgData: this.imgData,
                    imgTitle: this.imgTitle,
                    imgID: this.imgID
                });
                // xxx
                return;
            }
            navigator.camera.getPicture(
                res => {
                    // let res = window._pz.imgData;
                    this.imgData = 'data:image/jpeg;base64,' + res;
                    this.$emit('imageAdded', {
                        imgData: this.imgData,
                        imgTitle: this.imgTitle,
                        imgID: this.imgID
                    });

                },
                err => { throw new Error(err); },
                {
                    'destinationType': window.Camera.DestinationType.DATA_URL,
                    'sourceType': window.Camera.PictureSourceType[source],
                    'quality': 30,
                    'encodingType': window.Camera.EncodingType.JPEG
                });
        },
        removeImage() {
            this.imgData = null;
            this.imgTitle = null;
            this.$emit('imageRemoved', this.imgID);
        }
    }
};


export default {
    name: 'PlaceImageOrder',
    data() {
        return {
            users: null,
            userID: null,
            pendingReq: false,
            errMsg: null,
            autocompleteRef: null,
            images: []
        };
    },
    components: {
        'image-card': imageCard
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
                    let results = [];
                    if (query.length === 0) {
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
        },
        imageAdded(obj) {
            this.images.push(obj);
        },
        imageRemoved(id) {
            var idx = this.images.findIndex(img => img.id === id);
            this.images.splice(idx, 1);
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
