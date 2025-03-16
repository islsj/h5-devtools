<script setup>
import { computed } from 'vue'

const props = defineProps({
  info: {
    type: Object,
    default() {
      return {}
    },
    required: true
  },
  deviceName: {
    type: String,
    default: true
  }
})

const fontSize = computed(() => props.info['font-size'])
const padding = computed(() => props.info['padding'])
</script>

<template>
  <div class="c-device-header">
    <div class="hour" data-v-9eed6d30="">2:07 PM</div>
    <div class="right" data-v-9eed6d30="">
      <svg
        class="power"
        data-v-9eed6d30=""
        fill="none"
        viewBox="0 0 33 21"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect data-v-9eed6d30="" fill="black" height="9" rx="2" width="6" y="12"></rect>
        <rect data-v-9eed6d30="" fill="black" height="12" rx="2" width="6" x="8.7002" y="9"></rect>
        <rect data-v-9eed6d30="" fill="black" height="16" rx="2" width="6" x="17.4004" y="5"></rect>
        <rect data-v-9eed6d30="" fill="black" height="21" rx="2" width="6" x="26.1006"></rect>
        <!--        #C3C2C3-->
      </svg>
      <div class="network" data-v-9eed6d30="">4G</div>
      <svg
        data-v-9eed6d30=""
        fill="none"
        height="16"
        viewBox="0 0 86 39"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          data-v-9eed6d30=""
          fill="transparent"
          height="35.5"
          rx="8.25"
          stroke="black"
          stroke-opacity="0.4"
          stroke-width="3.5"
          width="75.5"
          x="1.75"
          y="1.75"
        ></rect>
        <rect data-v-9eed6d30="" fill="black" height="26" rx="5" width="66" x="6.5" y="6.5"></rect>
        <path
          clip-rule="evenodd"
          d="M81.5 26.5C83.9363 24.9844 85.5 22.6361 85.5 20C85.5 17.3639 83.9363 15.0156 81.5 13.5V26.5Z"
          data-v-9eed6d30=""
          fill="black"
          fill-opacity="0.6"
          fill-rule="evenodd"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.c-device-header {
  pointer-events: none;
  font-family: 'system-ui', Avenir;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;

  height: 35px;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: v-bind(fontSize) !important;
  padding: v-bind(padding) !important;

  .hour {
    font-weight: 700;
    color: rgb(0, 0, 0);
  }

  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: rgb(0, 0, 0);
    font-weight: 700;

    .network {
      margin: 1px 4px 0px 0px;
    }

    .power {
      width: 14px;
      height: 16px;
      margin-right: 4px;
    }
  }
}
</style>
