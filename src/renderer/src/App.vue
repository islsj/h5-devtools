<script setup>
import { lightTheme } from 'naive-ui'

const themeOverrides = {
  common: {
    primaryColor: '#366ceb',
    primaryColorHover: '#4a8dfd',
    primaryColorPressed: '#1e4fa3'
  }
}
</script>

<template>
  <n-config-provider :theme="lightTheme" :theme-overrides="themeOverrides" class="c-app-content">
    <HeaderArea />
    <WorkArea />
  </n-config-provider>
</template>

<style lang="scss" scoped>
.c-app-content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
