<!--
  @author ztw
  @createdDate 2020/9/8 14:11
-->
<template>
  <view
      class="voyo-badge"
      :class="[
      '__badge-color-' + color,
      '__badge-size-' + size,
      marginSpace ? '__margin-space' : '',
      moreMini || moreMini === ''? '__more-mini': ''
    ]"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    color: {
      type: String, // 'primary' | 'primary2' | ...
      default: "primary",
    },
    size: {
      type: String, // mini | small | now | ...
      default: "mini",
    },
    marginSpace: {
      type: Boolean,
      default: true,
    },
    moreMini:{
      type:Boolean,
      default:false
    }
  },  
  methods: {},
};
</script>

<style lang="scss" scoped></style>