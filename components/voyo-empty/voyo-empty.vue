<template>
  <view class="voyo-an-fadeIn0 voyo-figure">
    <image class="_image" :src="setting.emptyImg"></image>
    <view class="_title">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { setting } from "../setting.service";
export default {
  data() {
    return {
      setting,
    };
  },
};
</script>

<style scoped></style>
