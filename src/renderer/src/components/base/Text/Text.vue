<script setup>
defineOptions({ name: 'Text' })

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="c-text g-text">{{ props.name }}</div>
</template>

<style lang="scss" scoped>
.c-text {
  color: var(--ev-c-text);
}
</style>
