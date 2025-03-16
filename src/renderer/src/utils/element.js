/**
 * 获取 HTML 元素的所有属性并转换为对象
 *
 * @param {HTMLElement} element - 要获取属性的 HTML 元素
 * @returns {Object} 返回包含所有属性的对象，键是属性名，值是属性值
 *
 * @example
 * // 示例 HTML:
 * // <div id="myElement" class="box" data-role="container" style="color: red;"></div>
 *
 * const element = document.getElementById('myElement');
 * const attributes = getElementAttributes(element);
 * console.log(attributes);
 * // 输出:
 * // {
 * //   "id": "myElement",
 * //   "class": "box",
 * //   "data-role": "container",
 * //   "style": "color: red;"
 * // }
 */
export function getElementAttributes(element) {
  return [...element.attributes].reduce((attrs, attr) => {
    attrs[attr.name] = attr.value
    return attrs
  }, {})
}

/**
 * 获取符合指定选择器的所有元素，并转换为数组
 *
 * @param {string} selector - CSS 选择器字符串，用于匹配元素
 * @returns {Array<Element>} 返回匹配的元素数组，如果没有匹配的元素，则返回空数组
 *
 * @example
 * // 获取所有 div 元素
 * const divs = getElementAll('div');
 * console.log(divs);
 *
 * @example
 * // 获取所有带有 .box 类名的元素
 * const boxes = getElementAll('.box');
 * console.log(boxes);
 *
 * @example
 * // 获取所有带有 data-role="container" 的元素
 * const containers = getElementAll('[data-role="container"]');
 * console.log(containers);
 */
export function getElementAll(selector) {
  return Array.from(document.querySelectorAll(selector))
}
