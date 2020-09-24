<template>
  <view class="voyo-an-fadeIn0 voyo-figure" @tap="viewTap">
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
  methods: {
    viewTap(e) {
      this.$emit("tap",e);
      this.$emit("click",e);
    }
  },
};
</script>

<style scoped></style>
