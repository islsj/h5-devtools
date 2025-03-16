/**
 * 在整个 document 以及所有 shadow DOM 内查找符合 CSS 选择器的元素
 * @param {string} selector - 需要查找的 CSS 选择器
 * @param {Document|ShadowRoot|Element} [root=document] - 查找的起点，默认为 document
 * @returns {Element|null} - 找到的元素（如果存在），否则返回 null
 */
export function querySelectorDeep(selector, root = document, shadowRoot) {
  // 先在当前 root 查找
  let element = root.querySelector(selector)
  if (element) return element

  // 遍历所有子元素，查找 shadowRoot 并递归搜索
  const allElements = root.querySelectorAll('*')
  for (const el of allElements) {
    if (el.shadowRoot) {
      element = querySelectorDeep(selector, el.shadowRoot)
      if (element) return element
    }
  }
  return null
}

/**
 * 在整个 document 以及所有 shadow DOM 内查找所有符合 CSS 选择器的元素
 * @param {string} selector - 需要查找的 CSS 选择器
 * @param {Document|ShadowRoot|Element} [root=document] - 查找的起点，默认为 document
 * @returns {Element[]} - 找到的所有匹配元素的数组
 */
export function querySelectorAllDeep(selector, root = document) {
  let elements = Array.from(root.querySelectorAll(selector))

  // 遍历所有子元素，递归进入 shadowRoot 查找更多匹配元素
  const allElements = root.querySelectorAll('*')
  for (const el of allElements) {
    if (el.shadowRoot) {
      elements = elements.concat(querySelectorAllDeep(selector, el.shadowRoot))
    }
  }
  return elements
}
