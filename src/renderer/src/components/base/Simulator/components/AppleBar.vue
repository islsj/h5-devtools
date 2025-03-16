<script setup>
defineProps({
  bottom: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="c-apple-bar" />
</template>

<style lang="scss" scoped>
.c-apple-bar {
  pointer-events: none;
  position: absolute;
  width: 146px;
  height: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10;
  bottom: v-bind(bottom);
  background: rgb(0, 0, 0);
  border-radius: 1000px;
  transition: 0.3s;
}
</style>
