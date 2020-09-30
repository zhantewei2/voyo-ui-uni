<template>
  <view @tap="viewTap" class="voyo-an-fadeIn0" :class="[typeClass]">
    <image class="_image" :src="setting.errorImg"></image>
    <view class="_title">
      <slot></slot>
    </view>
  </view>
</template>
<script>
import { setting } from "../setting.service";
import {isH5} from "../utils"
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
  methods:{
    viewTap(e){
      if(isH5){
        this.$emit("click",e);
        this.$emit("tap",e);
      }
    }
  }
};
</script>
