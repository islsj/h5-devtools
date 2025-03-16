<script setup>
import { computed, ref, useAttrs, watch } from 'vue'
import useHistoryUrl from '@/use/useHistoryUrl'

defineOptions({ name: 'AutoComplete' })
const attrs = useAttrs()
const historyUrl = useHistoryUrl()
const autoCompleteRef = ref()
const isShowMenu = ref(true)
const options = computed(function () {
  const originOptions = historyUrl.getters.urls
  let result = originOptions.filter((url) => {
    return typeof url === 'string' && url.includes(attrs.value)
  })
  if (isShowMenu.value) {
    result = originOptions
  }
  return result.slice(0, 10)
})

watch(
  () => attrs.value,
  function (nVal) {
    isShowMenu.value = false
  }
)

function click() {
  isShowMenu.value = true
  console.log('isShowMenu.value', isShowMenu.value)
}

function select() {
  autoCompleteRef.value.blur()
}
</script>

<template>
  <n-auto-complete
    ref="autoCompleteRef"
    :get-show="() => isShowMenu"
    :input-props="{
      ...$attrs['input-props'],
      autocomplete: 'disabled'
    }"
    :options="options"
    class="c-auto-complete"
    clearable
    placeholder="邮箱"
    v-bind="$attrs"
    @click="click"
    @select="select"
  />
</template>

<style lang="scss">
.n-base-select-option__content {
  width: 100%;
}

.n-base-select-option.n-base-select-option--show-checkmark {
  padding-right: var(--n-option-padding-right) !important;
}
</style>
