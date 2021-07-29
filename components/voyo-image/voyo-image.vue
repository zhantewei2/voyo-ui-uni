<template>
  <view
    :style="{
      width: width,
      height: height,
    }"
    class="voyo-image-simple"
    id="wrapper"
    :class="{
      __gentle: bgGentle,
    }"
  >
    <image
      v-if="loading"
      :src="loadImg"
      class="voyo-img-loading abs-center"
    ></image>
    <image
      :mode="mode"
      v-if="!loadError && lazyOnce"
      :class="{
        '_img-loading': !lazyShow || !loadSuccess,
      }"
      class="voyo-an-fade0 abs-full"
      @load="success"
      @error="error"
      :src="src"
    ></image>
    <image
      class="voyo-img-loading abs-center"
      v-if="loadError"
      :src="loadErrImg"
      mode="aspectFit"
    ></image>
  </view>
</template>

<script>
import { setting } from "../setting.service";
import { querySelector } from "../utils";

export default {
  props: {
    aspectRatio: {
      type: Boolean,
      default: false, // height/width
    },
    width: {
      type: String,
      default: "100%", 
    },
    intersectionRatio: {
      type: Number,
      default: null,
    },
    src: {
      required:true,
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "scaleToFill",
    },
    bgGentle: {
      type: Boolean,
      default: true,
    },
  },
  watch: {},
  data() {
    return {
      height: "",
      loadImg: setting.imgLoadImg,
      loadErrImg: setting.errorImg,
      loading: false,
      lazyShow: false,
      loadSuccess: false,
      loadError: false,
      lazyOnce: false,
    };
  },
  methods: {
    //calculate height
    getWidth() {
      return querySelector(
        () =>
          uni
            .createSelectorQuery()
            .in(this)
            .select(".voyo-image-simple")
            .boundingClientRect(),
        ([rect]) => !rect || !rect.width,
      ).then(([rect]) => rect.width);
    },
    success() {
      this.loadSuccess = true;
      this.loading = false;
    },
    error() {
      this.loadError = true;
      this.loading = false;
    },
  },
  async mounted() {
    if (this.aspectRatio) {
      const width = (await this.getWidth()) || 0;
      this.height = width * this.aspectRatio + "px";
    } else {
      this.height = "100%";
    }

    this.loading = true;
    if (this.intersectionRatio != null) {
      this.observe = this.createIntersectionObserver({});
      this.observe.relativeToViewport();
      this.observe.observe(".voyo-image-simple", (e) => {
        if (e.intersectionRatio > 0) {
          this.lazyShow = this.lazyOnce = true;
        } else {
          this.lazyShow = false;
        }
      });
    } else {
      this.lazyShow = this.lazyOnce = true;
    }
  },
  beforeDestroy() {
    this.observe && this.observe.disconnect();
  },
};
</script>

<style scoped></style>
