<template>
  <div class="count-box">
    <!-- value等于1时，商品数量不能再减 -->
    <button @click = "handleSub" :class="{ minus: true, active: value === 1 }">-</button>
    <input :value = "value" @change="handleChange" type="text" class="inp">
    <!-- value等于库存数时，商品数量不能再加 -->
    <button @click = "handleAdd" :class="{ add: true, active: value === proStock }">+</button>
  </div>
</template>

<script>
export default {
  props: { // 通过props接收父组件传过来的value数据
    value: {
      type: Number,
      default: 1
    },
    proStock: { // 通过props接收父组件传过来的proStock数据
      type: Number
    }
  },

  methods: {
    handleSub () {
      if (this.value <= 1) { // 用于判断购买商品的数据不能小于1.
        return
      }
      this.$emit('input', this.value - 1) // 因为父组件中用的是v-model。v-model是value和@input方法组成的。所以这里的传参是input，作为修改父组件数据的方法
    },

    handleAdd () {
      if (this.value === this.proStock) { // 用于判断购买商品的数据不能大于库存数据
        return
      }
      this.$emit('input', this.value + 1)
    },

    handleChange (e) { // 用于判断input输入框内的内容合法
      // console.log(e.target.value)
      const num = +e.target.value // 转数字处理 (1) 数字 (2) NaN

      // 输入了不合法的文本 或 输入了负值，回退成原来的 value 值
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }

      this.$emit('input', num)
    }
  }
}
</script>

<style lang = "less" scoped>
  .count-box {
    width: 110px;
    display: flex;
    .add, .minus {
      width: 30px;
      height: 30px;
      outline: none;
      border: none;
      background-color: #efefef;
    }
    .inp {
      width: 40px;
      height: 30px;
      outline: none;
      border: none;
      margin: 0 5px;
      background-color: #efefef;
      text-align: center;
    }
    .active {
      color: #4c494932;
    }
  }
</style>
