<template>
    <div class="list-item row pz-padding-tb-4 pz-padding-l16 pz-word-wrap-brk">
        <span class="color-gray pz-weight-thin" :class="'col-'+leftColWidth" style="text-transform: capitalize;" v-html="label"></span>
        <span :class="'col-'+rightColWidth">
            <span v-if="!hasCustomValueSlot">{{value}}</span>
            <span v-if="hasCustomValueSlot">
                <slot></slot>
            </span>
        </span>
    </div>
</template>

<style scoped>
.list-item:nth-child(even) {
  background: #fafafa;
}
</style>

<script>
export default {
    props: {
        label: String,
        value: {
            default: '(Not available)'
        },
        leftColWidth: {
            default: 35
        },
        rightColWidth: {
            default: 65
        }
    },
    computed: {
        hasCustomValueSlot() {
            return !!this.$slots.default;
        }
    }
};
</script>