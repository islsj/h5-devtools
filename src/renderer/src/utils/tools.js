import { calc } from '@/utils/calc'

// 合并两个数组，确保按照第一个数组的顺序排列，新增的项放在后面
export function mergeArraysWithOrder(arr1, arr2) {
  const set1 = new Set(arr1) // 使用 Set 加速查找
  const newItems = arr2.filter((item) => !set1.has(item)) // 筛选出第二个数组中未出现在第一个数组的项
  return [...arr1, ...newItems] // 返回按顺序合并后的数组
}

/**
 * 存取数据工具函数
 * @param { 'local' | 'session' } storageType - 存储类型
 * @example cache('local').setItem('token', value)
 */
export function cache(storageType) {
  if (!['local', 'session'].includes(storageType)) {
    console.error(`cache函数仅支持 'local' 和 'session' 存储类型`)
    return
  }

  const PREFIX = 'dev-tools-'
  const storage = window[`${storageType}Storage`]

  /**
   * 获取数据
   * @param { string } key - 存储键
   * @returns { any } - 解析后的数据
   */
  function getItem(key) {
    try {
      const data = storage.getItem(PREFIX + key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`cache函数异常 (getItem):`, error)
      return null
    }
  }

  /**
   * 存储数据
   * @param { string } key - 存储键
   * @param { any } value - 存储值
   */
  function setItem(key, value) {
    try {
      const data = typeof value === 'object' ? JSON.stringify(value) : String(value)
      storage.setItem(PREFIX + key, data)
    } catch (error) {
      console.error(`cache函数异常 (setItem):`, error)
    }
  }

  /**
   * 清除指定数据
   * @param { string } key - 要清除的键
   */
  function removeItem(key) {
    try {
      storage.removeItem(PREFIX + key)
    } catch (error) {
      console.error(`cache函数异常 (removeItem):`, error)
    }
  }

  /**
   * 清除所有带前缀的数据
   */
  function clearAll() {
    try {
      Object.keys(storage).forEach((key) => {
        if (key.startsWith(PREFIX)) {
          storage.removeItem(key)
        }
      })
    } catch (error) {
      console.error(`cache函数异常 (clearAll):`, error)
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clearAll
  }
}

/**
 * 按步长调整到最近值
 * @param {number} num - 原始数值
 * @param {number} step - 调整步长
 * @param {String} mode - 调整步长
 * @returns {number} - 调整后的值
 */
export function adjustWithStep(num, step, mode) {
  const MIN = 0.5
  const MAX = 2
  // 生成目标值集合
  let targets = []
  for (let i = MIN; i <= MAX; i = calc(i).add(step).result()) {
    targets.push(calc(i).add(step).result()) // 精确到小数点后两位
  }

  if (mode === '+') {
    // 根据增加或减少来决定向上或向下取整
    const t = targets.find((target) => target >= num) // 增加时，取大于等于当前值的最小值
    if (num >= MAX) {
      return MAX
    } else {
      return t === num ? calc(t).add(step).result() : t
    }
  }
  if (mode === '-') {
    const t = targets.reverse().find((target) => target <= num) // 减少时，取小于等于当前值的最大值
    if (num <= MIN) {
      return MIN
    } else {
      return t === num ? calc(t).subtract(step).result() : t
    }
  }
}

/**
 * 将小数转换为百分数
 * @param {number|string} decimal - 小数（如 0.83）
 * @param {number} precision - 保留的小数位数（默认 2）
 * @returns {string} 百分数（如 "83.00%"）
 */
export function decimalToPercent(decimal, precision = 2) {
  if (!['number', 'string'].includes(typeof decimal)) {
    throw new Error('参数必须是数字或字符串')
  }
  const percent = calc(decimal).multiply(100).result().toFixed(precision) // 转为百分数并保留指定小数位
  return `${percent}%` // 拼接百分号
}

/**
 * 精确保留小数位数，避免浮点误差
 * @param {number} num - 输入的数字
 * @param {number} precision - 保留的小数位数，默认 2
 * @returns {number} 返回保留指定小数位数的字符串
 */
export function toFixedPrecision(num, precision = 2) {
  if (!['number', 'string'].includes(typeof num)) {
    throw new Error('参数必须是数字或字符串')
  }

  // 使用 toFixed 精确保留小数并返回字符串
  return Number(num.toFixed(precision))
}

/**
 * 生成一个符合 UUIDv4 标准的唯一标识符
 * @returns {string} 返回一个符合 UUIDv4 格式的唯一标识符
 * @example
 * // 示例
 * generateUUID(); // 返回类似 'f47b334e-8e7f-4c9b-919d-8a6902b55717' 的字符串
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0 // 获取一个 0-15 的随机数
    const v = c === 'x' ? r : (r & 0x3) | 0x8 // 如果是 'x'，则使用随机数；如果是 'y'，则生成符合 UUIDv4 的值
    return v.toString(16) // 转换为十六进制
  })
}

/**
 * 监听指定元素的事件，并在事件触发一次后返回一个 Promise 解析该事件对象。
 *
 * @param {EventTarget} element - 监听事件的目标元素。
 * @param {string} eventName - 要监听的事件名称。
 * @returns {Promise<Event>} 返回一个 Promise，在事件触发时解析该事件对象。
 */
export function emittedOnce(element, eventName) {
  return new Promise((resolve) => {
    element.addEventListener(eventName, (event) => resolve(event), { once: true })
  })
}
