<template>
    <div></div>
</template>

<style scoped>
div {
  position: absolute;
  top: 0px;
  animation: loader 1.4s linear infinite;
  display: none;
  border-bottom: 1px solid black;
}
@keyframes loader {
  0% {
    left: 0;
    right: 100%;
  }
  25% {
    left: 0;
    right: 50%;
  }
  50% {
    left: 0;
    right: 0%;
  }
  75% {
    left: 50%;
    right: 0;
  }
  100% {
    left: 100%;
    right: 0;
  }
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