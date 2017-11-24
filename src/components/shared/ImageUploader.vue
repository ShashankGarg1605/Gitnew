<template>
    <section class="pz-width100">
        <a href="#" class="button button-raised pz-flex-sa-c pz-bg-gray-white color-gray" @click="uploadChoices()" :disabled="images.length==maxCount">
            Add {{images.length? 'another': ''}} image
            <icon name="plus"></icon>
        </a>
        <div class="pz-padding-t16" v-show="images.length">
            <span class="color-gray pz-size-small" v-if="tooltip">Tap image for options</span>
            <div v-if="inputTitles">
                <span v-for="(image, index) in images" :key="index" class="pz-flex pz-margin-b8">
                    <img :src="'data:image/jpeg;base64,' + images[index].data" class="pz-margin-r8 image" @click="thumbnailClick(index)">
                    <input type="text" placeholder="Title (optional)" v-model="images[index].title">
                </span>
            </div>

            <div v-else>
                <img v-for="(image, index) in images" :key="index" :src="'data:image/jpeg;base64,' + images[index].data" class="pz-margin-r8 image" @click="thumbnailClick(index)">
            </div>
        </div>
        <a href="#" class="button button-raised pz-flex-sa-c pz-bg-gray-white" @click="uploadImages()" v-if="!hideSubmitBtn && images.length>0">
            {{submitLabel}}
            <icon name="cloud-upload"></icon>
        </a>
    </section>
</template>

<style scoped>
input {
  flex-grow: 1;
  border: 1px dashed lightgrey;
  border-radius: 3px;
  font-size: 1em;
}
</style>

<script>
export default {

    props: ['maxCount', 'submitLabel', 'inputTitles', 'tooltip', 'hideSubmitBtn'],
    data() {
        return {
            images: []
        };
    },
    methods: {
        uploadChoices() {
            let buttons = [
                { text: 'Upload invoice using', label: true },
                {
                    text: 'Camera',
                    onClick: function () { this.getImage('CAMERA'); }.bind(this)
                },
                {
                    text: 'Gallery',
                    onClick: function () { this.getImage('PHOTOLIBRARY'); }.bind(this)
                }
            ];
            window.vm.$f7.actions(buttons);
        },
        getImage(source) {
            if (!navigator.camera) {
                // xxx
                let res = window._pz.imgData;
                this.images.push({
                    data: res,
                    title: ''
                });
                this.$emit('added', this.images);
                // xxx
                return;
            }
            navigator.camera.getPicture(
                res => {
                    this.images.push({
                        data: res,
                        title: ''
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
        thumbnailClick(index) {
            let buttons = [
                {
                    text: 'View',
                    onClick: function () {
                        this.openZoomView(index);
                    }.bind(this)
                },
                {
                    text: 'Remove',
                    onClick: function () {
                        this.images.splice(index, 1);
                        this.$emit('removed', this.images);
                    }.bind(this)
                }
            ];
            window.vm.$f7.actions(buttons);
        },
        openZoomView(index) {
            var a = window.vm.$f7.photoBrowser({
                type: 'popup',
                theme: 'dark',
                toolbar: false,
                navbarTemplate: `<div class="navbar">
                                    <div class="navbar-inner">
                                        <div class="left sliding">
                                            <a href="#" class="link close-popup photo-browser-close-link icon-only">
                                                <i class="icon icon-back"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>`,
                photos: ['data:image/jpeg;base64,' + this.images[index].data]
            }); a.open();
        },
        uploadImages() {
            this.$emit('upload', this.images);
        }
    }
};
</script>