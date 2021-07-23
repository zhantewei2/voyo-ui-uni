<template>
  <view>
    <view
      v-if="visible"
      class="voyo-load-wrapper"
      :class="[
        block || block === '' ? '__block' : '__inline',
        '__size-' + size,
        abs || abs === '' ? '__abs' : '',
        show0 ? 'voyo-an-fadeIn0' : 'voyo-an-fadeOut0',
        absCenter || absCenter === '' ? 'abs-center' : '',
        fixCenter || fixCenter === '' ? 'fix-center' : '',
        imgType === 'block' ? '__type-block' : '',
        absCenterPage || absCenterPage === '' ? 'abs-center-page' : '',
      ]"
      :style="{
        marginTop: abs || abs === '' ? '' : top + 'px',
        top: abs || abs === '' ? top + 'px' : '',
      }"
    >
      <view class="_view">
        <!--        <text-->
        <!--          class="za za-loading voyo-an-loading _textIcon voyo-color-des"-->
        <!--        ></text>-->
        <view class="_img-wrapper">
          <!--          #ifdef MP-WEIXIN-->
          <image class="_img" :src="loadImg" />
          <!--          #endif-->
          <!--          #ifdef ENV-H5-->
          <img class="_img" :src="loadImg" />
          <!--          #endif-->
        </view>
        <view :class="[$slots.default?'_text':'']">
          <slot></slot>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { setting } from "../setting.service";
// export type SizeVarious="mini"|"small"|"now"|"medium"|"strong"|"large";

export default {
  data() {
    return {
      loadImg: "",
      show0: false,
      visible: false,
    };
  },
  props: {
    imgType: {
      type: String, // "default" | "block"
      default: "default",
    },
    block: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "now",
    },
    fixCenter: {
      type: Boolean,
      default: false,
    },
    abs: {
      type: Boolean,
      default: false,
    },
    absCenter: {
      type: Boolean,
      default: false,
    },
    absCenterPage: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(v) {
        v ? this.toShow() : this.toHide();
      },
    },
    imgType: {
      immediate: true,
      handler(v) {
        if (v === "default") {
          this.loadImg = setting.loadImg;
        } else if (v === "block") {
          this.loadImg = setting.loadBlockImg;
        }
      },
    },
  },
  methods: {
    toShow() {
      if (this.show0) return;
      this.clearLeave();
      this.visible = this.show0 = true;
    },
    toHide() {
      if (!this.show0) return;
      this.show0 = false;
      this.leave();
    },
    clearLeave() {
      if (this.leaveTimeout) {
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = null;
      }
    },
    leave() {
      this.clearLeave();
      this.leaveTimeout = setTimeout(() => {
        this.visible = false;
        this.leaveTimeout = null;
      }, 300);
    },
  },
};
</script>
<style lang="scss"></style>
