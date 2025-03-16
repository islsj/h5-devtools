import Decimal from 'decimal.js'

export function calc(n = 0) {
  const context = {
    value: new Decimal(n),

    add(n) {
      context.value = context.value.plus(n)
      return context
    },

    subtract(n) {
      context.value = context.value.minus(n)
      return context
    },

    multiply(n) {
      context.value = context.value.times(n)
      return context
    },

    divide(n) {
      if (new Decimal(n).isZero()) {
        throw new Error('Division by zero is not allowed')
      }
      context.value = context.value.div(n)
      return context
    },

    result() {
      return context.value.toNumber()
    }
  }

  return context
}
