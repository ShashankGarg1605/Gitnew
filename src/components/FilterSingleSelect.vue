<template>
    <li class="item-content button pz-colr-inherit pz-cap" @click="openManually()">
        <div class="item-media">
            <icon name="dot-circle-o"></icon>
        </div>
        <div class="item-inner pz-margin-l0">
            <a href="#" class="item-link smart-select pz-width100" data-back-on-select="true" id="singleselect">
                <select v-model="compvalue">
                    <option v-for="(option, index) in opts" :key="index" :value="option.value" :selected="option.selected">{{option.label}}</option>
                </select>
                <div class="item-content pz-padding-l0 pz-size-normal text-container">
                    <div>
                        <span>{{placeholder}}</span>
                    </div>
                    <span class="selected-values">{{selectedWord}}</span>
                </div>
            </a>
            <div class="item-after">
                <span>
                    <icon name="chevron-right"></icon>
                </span>
            </div>
        </div>
    </li>
</template>

<style scoped>
.selected-values {
    position: absolute !important;
    left: 0px !important;
    bottom: -10px !important;
    color: #419688 !important;
    font-size: x-small !important;
}

.text-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    line-height: 37px !important;
}
</style>

<script>
export default {
    name: 'FilterSingleSelect',
    data() {
        return {
            compvalue: null,
            compvalueActual: null   //the actual milliseconds date, separated by pipe
        };
    },
    computed: {
        selectedWord() {
            let selectedOption = this.opts.find(o => o.value === this.compvalue);
            return selectedOption && selectedOption.label;
        }
    },
    props: ['placeholder', 'opts', 'value'],
    watch: {
        'compvalue': function() {
            // When the internal value changes, we $emit an event. Because this event is 
            // named 'input', v-model will automatically update the parent value
            this.compvalueActual = this.compvalue;
            this.$emit('input', this.compvalueActual);
        }
    },
    methods: {
        openManually(e) {
            window.vm.$f7.smartSelectOpen('#singleselect');
        }
    },
    beforeCreate() { console.debug(this.$options.name + ' beforeCreate'); },
    created() {
        console.debug(this.$options.name + ' created');
        this.compvalue = this.value;

        window.Dom7('#singleselect').on('click', function() {
            console.log('click detected');
        });
    },
    beforeMount() { console.debug(this.$options.name + ' beforeMount'); },
    mounted() { console.debug(this.$options.name + ' mounted'); },
    beforeUpdate() { console.debug(this.$options.name + ' beforeUpdate'); },
    updated() { console.debug(this.$options.name + ' updated'); },
    beforeDestroy() { console.debug(this.$options.name + ' beforeDestroy'); },
    destroyed() { console.debug(this.$options.name + ' destroyed'); }
};
</script>
