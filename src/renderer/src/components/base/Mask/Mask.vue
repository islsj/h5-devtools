<script setup>
// eslint-disable-next-line vue/no-reserved-component-names
defineOptions({ name: 'Mask' })
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="props.show" class="c-mask" />
</template>

<style lang="scss" scoped>
.c-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
}
</style>
