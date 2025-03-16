<script setup>
import { ref } from 'vue'

const dragStatus = ref('drag')

function mousedown() {
  dragStatus.value = 'drag'
}

function contextmenu() {
  dragStatus.value = 'no-drag'
}
</script>

<template>
  <div class="c-header" @contextmenu="contextmenu" @mousedown="mousedown">
    <windowTabs />
    <!--    <Empty />-->
    <!--    <windowMenu />-->
  </div>
</template>

<style lang="scss" scoped>
.c-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: var(--ev-c-header-background);
  padding: 0 10px;
  -webkit-app-region: v-bind(dragStatus);
}
</style>
