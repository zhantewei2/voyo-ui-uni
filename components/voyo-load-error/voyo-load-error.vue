<template>
  <view class="voyo-an-fadeIn0" :class="[typeClass]">
    <image class="_image" :src="setting.errorImg"></image>
    <view class="_title">
      <slot></slot>
    </view>
  </view>
</template>
<script>
import { setting } from "../setting.service";
export default {
  props: {
    type: {
      type: String,
      default: "pagination",
    },
  },
  computed: {
    typeClass() {
      if (this.type === "pagination") {
        return "voyo-figure";
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      setting,
    };
  },
};
</script>
