<template>
  <view :class="[popupStyle ? 'voyo-rf-rotate-popup' : '']">
    <view
      :change:prop="controller.valueChange"
      :prop="wxsValue"
      class="voyo-vf-rotate-figure"
    >
      <view class="voyo-vf-rotate-figure-container">
        <view class="voyo-vf-rotate-figure-image">
          <image
            class="_image voyo-an-fadeIn"
            :src="image"
            mode="aspectFill"
            :style="{
              display: image ? 'block' : 'none',
            }"
          ></image>
          <image
            :src="image0"
            @error="image0Error"
            @load="image0Load"
            class="_image _image0"
          ></image>
        </view>
        <view class="_title flex-center-column voyo-an-fadeIn" v-if="success">
          <image class="_iconImg" :src="successImg"></image>
          <text class="voyo-text-content">已通过校验</text>
          <text class="voyo-des-line"
            >验证耗时
            <text class="voyo-text-size-now mx-1 voyo-color-primary">{{
              duration
            }}</text>
            秒</text
          >
        </view>
        <view
          @tap="reload"
          class="_title flex-center-column voyo-an-fadeIn"
          v-if="failure"
        >
          <image class="_iconImg" :src="errorImg"></image>
          <text class="voyo-text-des">图片加载失败请重试</text>
        </view>
      </view>
      <voyo-load absCenter :show="image0Loading"></voyo-load>
    </view>
    <view class="voyo-vf-rotate-thumb-wrapper">
      <view class="voyo-vf-rotate-thumb">
        <view
          class="voyo-vf-rotate-thumb-bar"
          @touchmove="controller.touchMove"
          @touchstart="controller.touchStart"
          @touchend="controller.touchEnd"
        ></view>
      </view>
      <view class="voyo-vf-rotate-thumb-message"
        >拖动上方滑块，使得图片正位展示</view
      >
    </view>
    <slot></slot>
  </view>
</template>

<template module="controller" lang="wxs" src="./voyo-vf-rotate.wxs"></template>
<script>
import { setting } from "../setting.service";

export default {
  props: {
    errorRange: {
      type: Number,
      default: 25,
    },
    popupStyle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
      image: "",
      image0: "",
      image0Loading: false,
      wxsValue: "",
      rotateStart: 0,
      failure: false,
      success: false,
      successImg: setting.vfRotateSuccessImg,
      errorImg: setting.vfRotateFailImg,
      duration: 0,
    };
  },
  beforeCreate() {
    this.startCountTime = null;
    this.image0LoadCb = null;
  },
  created() {
    this.loadReady();
  },
  methods: {
    image0Error(e) {
      console.error(e);
      this.image0Loading = false;
      this.failure = true;
    },
    image0Load() {
      this.image0Loading = false;
      this.image = this.image0;
      this.image0LoadCb && this.image0LoadCb();
    },
    toShow() {
      this.show = !this.show;
    },
    showChange(e) {
      this.show = e;
    },
    showMessage(...v) {
      console.log(...v);
    },
    loadReady() {
      return new Promise((resolve, reject) => {
        this.image = "";
        const imgs = setting.vfRotateImgs;
        const img = imgs[Math.floor(Math.random() * imgs.length)];
        this.image0 = img;
        this.image0Loading = true;
        this.image0LoadCb = () => {
          resolve(true);
        };
      });
    },
    /**
     *
     * @returns {number} (2--7) *360
     */
    getRotate() {
      return ((Math.round(Math.random()) * 5 + 2) / 10) * 360;
    },
    touchEnd(barRotate) {
      if (this.success) return;
      let r = barRotate % 360;
      r = r >= 180 ? 360 - 180 : r;
      if (r <= this.errorRange) {
        this.endCount();
        this.success = true;
        setTimeout(() => {
          this.$emit("success", true);
        }, 1500);
      }
    },
    startCount() {
      this.startCountTime = new Date().getTime();
    },
    endCount() {
      this.duration =
        Math.round((new Date().getTime() - this.startCountTime) / 100) / 10;
    },
    reload() {
      this.$emit("reload", true);
    },
    getRect() {
      return new Promise((resolve, reject) => {
        uni
          .createSelectorQuery()
          .in(this)
          .select(".voyo-vf-rotate-thumb")
          .boundingClientRect()
          .select(".voyo-vf-rotate-thumb-bar")
          .boundingClientRect()
          .exec(([thumbRect, barRect]) => {
            this.rotateStart = this.getRotate();
            resolve(`${thumbRect.width}-${barRect.width}-${this.rotateStart}`);
          });
      });
    },
  },
  mounted() {
    Promise.all([this.getRect(), this.loadReady()]).then(([wxsValue, v]) => {
      this.wxsValue = wxsValue;
      this.startCount();
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./voyo-vf-rotate.scss";
</style>
