<!--
  @author ztw
  @createdDate 2020/10/20 11:21
-->
<template>
  <view>
    <view
        v-if="visible"
        class="voyo-alert"
        :class="[
        'voyo-alert-bg-' + bgColor,
        'voyo-alert-font-' + fontColor,
        'voyo-text-size-' + size,
        round?'__round':''
      ]"
    >
      <view v-if="$slots.prefix" class="_voyo-alert-prefix">
        <slot name="prefix"></slot>
      </view>
      <view class="_voyo-alert-content">
        <slot></slot>
      </view>
      <view v-if="$slots.suffix" class="_voyo-alert-suffix">
        <slot name="suffix"></slot>
      </view>
      <view @tap="closeTap" v-if="useClose" class="_voyo-alert-close">
        <text :class="[closeIconClassName]"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { setting } from "@voyo/ui-uni/components/setting.service";

export default {
  props: {
    useClose: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: "primary",
    },
    fontColor: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "small",
    },
    round:{
      type:Boolean,
      default:false
    }
  },
  beforeCreate() {
    // this.excuteAfterConnected = new ExcuteAfterConnected();
  },
  data() {
    return {
      visible: true,
      closeIconClassName: setting.popupCloseIconClassName,
    };
  },
  methods: {
    closeTap() {
      this.visible = false;
      this.$emit("close", true);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>