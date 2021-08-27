<!--
  @author ztw
  @createdDate 2020/9/8 10:16
-->
<template>
  <view
      class="voyo-divider-wrapper"
      :class="[
      '__divider-direction-' + direction,
      '__divider-position-' + contentPosition,
    ]"
  >
    <template v-if="direction === 'horizontal'">
      <view class="_divider-left-line"></view>
      <view class="_divider-content">
        <slot></slot>
      </view>
      <view class="_divider-right-line"></view>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: "horizontal", //"horizontal "| "vertical"
    },
    contentPosition: {
      type: String,
      default: "center", // "center" | "left" | "right"
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>