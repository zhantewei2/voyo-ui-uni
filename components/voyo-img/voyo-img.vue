<template>
  <view
    id="img-container"
    :class="[
      'voyo-img-container',
      allClass,
      gentle || gentle === '' ? '__gentle' : '',
    ]"
    :style="{
      height: viewHeight,
      width: imgWidth ? imgWidth : '',
    }"
  >
    <image
      v-if="loading"
      :src="loadImg"
      class="abs-center voyo-img-loading voyo-text-size-strong"
    />
    <image
      v-if="value"
      :style="{
        height: imgHeight ? imgHeight + 'px' : '',
        width: '100%',
      }"
      @load="imageSuccess"
      @error="imageError"
      :class="[
        !imgShow ? 'voyo-img-ready' : 'voyo-an-fadeIn0 ' + imgClass,
        allClass,
      ]"
      :src="value"
      :mode="mode"
    ></image>
  </view>
</template>

<script>
import { ExcuteAfterConnected } from "../utils";
import { setting } from "../setting.service";

export default {
  data() {
    return {
      value: "",
      imgHeight: "",
      loading: false,
      loadEnd: false,
      loadImg: setting.imgLoadImg,
      imgShow: false,
    };
  },
  computed: {
    viewHeight() {
      if (this.loading && this.loadHeight) return this.loadHeight;
      if (this.imgHeight) return this.imgHeight + "px";
      return "";
    },
  },
  props: {
    src: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "aspectFit",
    },
    allClass: {
      type: String,
    },
    imgClass: {
      type: String,
      default: "voyo-img-default",
    },
    aspect: {
      type: Number,
    },
    gentle: {
      type: Boolean,
      default: false,
    },
    loadHeight: {
      type: String,
    },
    imgWidth: {
      type: String,
      default: "",
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    autoLoad: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    src: {
      handler(v) {
        this.readyValue = v;
        if (this.autoLoad) this.imageLoadStart();
      },
      immediate: true,
    },
    visible: {
      handler(v) {
        this.visibleToggle(v);
      },
      immediate: true,
    },
  },
  methods: {
    visibleToggle(v) {
      if (v && this.loadEnd) this.showImage();
      this.visible0 = v;
    },
    loadManual() {
      this.imageLoadStart();
    },

    imageLoadStart() {
      this.value = this.readyValue;
      this.loading = true;
    },
    imageSuccess(e) {
      if (this.autoHeight) {
        this.excuteAfterGetRect.execute(() => {
          this.imgHeight = (e.detail.height / e.detail.width) * this.viewWidth;
        });
      }
      this.loading = false;
      this.loadEnd = true;
      this.$emit("load", e);
      if (this.visible0) this.showImage(e);
    },
    imageError(e) {
      this.loading = false;
      this.$emit("error", e);
    },
    showImage(e) {
      this.imgShow = true;
      this.$emit("show", e);
    },
    calHeight(w) {
      this.viewWidth = w;
      if (this.aspect) {
        this.imgHeight = w * this.aspect;
      }
      this.excuteAfterGetRect.connect();
    },
  },
  beforeCreate() {
    this.viewWidth = 0;
    this.excuteAfterGetRect = new ExcuteAfterConnected();
    this.readyValue = "";
    this.visible0 = true;
  },
  created() {
    if (this.imgWidth) {
      this.calHeight(this.imgWidth);
    }
  },

  mounted() {
    if (!this.imgWidth && (this.aspect || this.autoHeight)) {
      uni
        .createSelectorQuery()
        .in(this)
        .select("#img-container")
        .boundingClientRect()
        .exec(([rect]) => {
          this.calHeight(rect.width);
        });
    }
  },
};
</script>

<style scoped></style>
