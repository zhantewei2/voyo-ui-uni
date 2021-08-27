<!--
  @author ztw
  @createdDate 2020/9/15 14:33
-->
<template>
  <view
    class="voyo-image-simple"
    :style="{
      width: width + 'vw',
      height: height + 'vw',
    }"
    :class="[gentle ? '__gentle' : '']"
  >
    <image
      :src="imgLoadImg"
      class="abs-center voyo-img-loading"
      v-if="loading"
    >
    </image>
    <image
      :src="src"
      :style="{
        backgroundImage: bgImg,
        width: width + 'vw',
        height: height + 'vw',
      }"
      :class="[loading ? '_img-loading' : '_img-loadEnd', 'voyo-an-fadeIn0']"
      :mode="mode"
      @load="loadSuccess"
      @error="loadError"
    >
    </image>
  </view>
</template>

<script>
import { setting } from "../setting.service";
const bgImg = "";
export default {
  beforeCreate() {
    this.fullWidth = 750;
  },
  props: {
    src: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "aspectFill",
    },
    widthRpx: {
      type: Number,
      default: 0,
    },
    heightRpx: {
      type: Number,
      default: 0,
    },
    aspect: {
      type: Number,
      default: 0,
    },
    autoStart: {
      type: Boolean,
      default: true,
    },
    gentle: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    widthRpx: {
      immediate: true,
      handler(v) {
        this.width = this.getVW(v);
      },
    },
    aspect: {
      immediate: true,
      handler(v) {
        if (!this.widthRpx || !v) return;
        this.height = this.width * v;
      },
    },
    heightRpx: {
      immediate: true,
      handler(v) {
        if (!v) return;
        this.height = this.getVW(v);
      },
    },
  },
  data() {
    return {
      imgLoadImg:setting.imgLoadImg,
      bgImg: `url('${bgImg}')`,
      width: 0,
      height: 0,
      loading: false,
      isLoadSuccess: false,
      isLoadError: false,
    };
  },
  created() {
    this.autoStart && this.startLoad();
  },
  methods: {
    getVW(rpxLen) {
      return (rpxLen / this.fullWidth) * 100;
    },
    startLoad() {
      this.isLoadSuccess = this.isLoadError = false;
      this.loading = true;
    },
    loadSuccess() {
      this.loading = false;
      this.isLoadSuccess = true;
    },
    loadError() {
      this.loading = false;
      this.isLoadError = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
