<template>
    <div class="row pz-padding-tb-4 pz-padding-l16 pz-size-smaller pz-word-wrap-brk" v-bind:class="{ 'pz-bg-gray-lightest': grayback}">
        <span class="col-35 color-gray pz-weight-thin ">{{label}}:</span>
        <span class="col-65 ">
            <span v-if="!hasCustomValueSlot">{{value}}</span>
            <span v-if="hasCustomValueSlot">
                <slot></slot>
            </span>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        value: {
            default: '(Not available)'
        },
        grayback: Boolean
    },
    computed: {
        hasCustomValueSlot() {
            return !!this.$slots.default;
        }
    }
};
</script>