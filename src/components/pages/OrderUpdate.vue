<template>
    <f7-page name="OrderUpdate">

        <f7-navbar back-link="Back" sliding>
            <f7-nav-center>
                Order Update
            </f7-nav-center>
        </f7-navbar>

        <p class="content-block-title">Upload Bilty using:</p>
        <div class="buttons-row content-block">
            <a href="#" class="button button-fill button-raised color-blue" @click="getImage('CAMERA')">Camera</a>
            <a href="#" class="button button-fill button-raised color-blue" @click="getImage('PHOTOLIBRARY')">Gallery</a>
        </div>

        <div class="card demo-card-header-pic" v-if="imgData">
            <div :style="styleObject" valign="bottom" class="card-header color-white no-border pz-card-head"></div>
            <div class="card-content">
                <div class="card-content-inner">
                    <p>Upload this image?</p>
                </div>
            </div>
            <div class="card-footer" style="justify-content: flex-end;">
                <a href="#" class="button color-red" @click="imgData=null">Cancel</a>
                <a href="#" class="button color-blue">Upload</a>
            </div>
        </div>

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

.pz-card-head {
    height: 400px;
    background-size: contain;
}
</style>
<script>
export default {
    name: 'OrderUpdate',
    data() {
        return {
            imgData: null,
            imgHeight: null,
            imgWidth: null,
            id: null,
            pendingReq: false,
            errMsg: null
        };
    },
    computed: {
        styleObject: function() {
            const width = window.Dom7('.pz-card-head').width();
            let height = parseInt(width * this.imgHeight / this.imgWidth) + 'px';
            let obj = {
                'background-image': `url( ${this.imgData} )`,
                'height': height
            };
            return obj;
        }
    },
    methods: {
        getImage(source) {
            if (!navigator.camera) return;
            navigator.camera.getPicture(
                res => {
                    this.imgData = 'data:image/jpeg;base64,' + res;

                    // set the height of card
                    var i = new Image();
                    i.onload = () => { this.imgHeight = i.height; this.imgWidth = i.width; };
                    i.src = this.imgData;
                },
                err => { throw new Error(err); },
                {
                    'destinationType': window.Camera.DestinationType.DATA_URL,
                    'sourceType': window.Camera.PictureSourceType[source],
                    'quality': 30,
                    'encodingType': window.Camera.EncodingType.JPEG
                });
        }
    },
    created: function() {
        console.log('Order Update created');
        this.id = this.$route.options.context && this.$route.options.context.id;
    }
};
</script>
