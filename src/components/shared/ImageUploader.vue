<template>
    <section>
        <a href="#" class="button button-raised pz-flex-sa-c pz-bg-gray-white color-gray" @click="uploadChoices()" :disabled="images.length==maxCount">
            Add {{images.length? 'another': ''}} image
            <icon name="plus"></icon>
        </a>
        <div class="pz-padding-t16">
            <img v-for="(image, index) in images" :key="index" :src="images[index]" class="pz-margin-r8 image" @click="thumbnailClick(index)">
        </div>
        <a href="#" class="button button-raised pz-flex-sa-c pz-bg-gray-white" @click="uploadImages()" v-if="images.length>0">
            {{submitLabel}}
            <icon name="cloud-upload"></icon>
        </a>
    </section>
</template>

<style scoped>
.image {
    height: 40px;
    width: 40px;
    border-radius: 3px;
    box-shadow: 0px 1px 1px 0px lightgrey;
}
</style>

<script>
export default {

    props: ['maxCount', 'submitLabel'],
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
                this.images.push('data:image/jpeg;base64,' + res);
                // xxx
                return;
            }
            navigator.camera.getPicture(
                res => {
                    this.images.push('data:image/jpeg;base64,' + res);
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
                    onClick: function() {
                        this.openZoomView(index);
                    }.bind(this)
                },
                {
                    text: 'Remove',
                    onClick: function() {
                        this.images.splice(index, 1);
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
                photos: [this.images[index]]
            }); a.open();
        },
        uploadImages() {
            this.$emit('upload',
                this.images
            );
        }
    }
};
</script>