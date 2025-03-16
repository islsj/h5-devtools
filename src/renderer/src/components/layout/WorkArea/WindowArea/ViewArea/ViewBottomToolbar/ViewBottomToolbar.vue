<script setup></script>

<template>
  <div class="c-view-bottom-toolbar">
    <Device />
    <div class="c-line" />
    <ViewportSize />
  </div>
</template>

<style lang="scss" scoped>
.c-view-bottom-toolbar {
  background-color: var(--ev-c-background-canvas);
  border-radius: 0 0 8px 8px;
  border-top: solid 1px #d6e2fb;
  color: #474747;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 24px;
  padding: 0 6px;

  .c-line {
    width: 1px;
    margin: 5px 4px;
    height: 16px;
    background-color: #d6e2fb;
  }
}
</style>
