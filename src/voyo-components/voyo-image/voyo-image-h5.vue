<template>
  <div
      :style="{
      width: width,
      height: height,
    }"
      class="voyo-image-simple"
      id="wrapper"
      :class="{
      __gentle: bgGentle,
    }"
      ref="wrapper"
  >
    <img v-if="loading" :src="loadImg" class="voyo-img-loading abs-center" />
    <div v-if="loadSuccess && lazyShow" :style="{
      backgroundImage: 'url('+src+')',
      backgroundSize: 'cover'
    }"
         class="voyo-an-fadeIn0 abs-full"
         :class="['img-'+mode]"
    >

    </div>
    <image
        class="voyo-img-loading abs-center"
        v-if="loadError"
        :src="loadErrImg"
    />
  </div>
</template>

<script>
import { setting } from "../setting.service";

export default {
  props: {
    aspectRatio: {
      type: Number,
      default: 0, // height/width
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
    lazyDelayShow: {
      type: Number,
      default: 150,
    },
    performance:{
      type: Boolean,
      default: true
    },
    relativeViewport:{},
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
      return this.$refs.wrapper.offsetWidth;
    },
    success() {
      this.loadSuccess = true;
      this.loading = false;
    },
    error() {
      this.loadError = true;
      this.loading = false;
    },
    watchIntersection() {
      if (this.intersectionRatio != null && window.IntersectionObserver) {
        const clearDelayShow = () => {
          if (this.delayShow) {
            clearTimeout(this.delayShow);
            this.delayShow = null;
          }
        };
        this.intersection = new IntersectionObserver((entries) => {
          const entry = entries[0];
          clearDelayShow();
          if (entry.isIntersecting) {
            this.delayShow = setTimeout(() => {
              this.loadImage(this.src);
              this.lazyShow = this.lazyOnce = true;
              this.delayShow = null;
              if(!this.performance){
                this.intersection&&this.intersection.disconnect();
                this.intersection=null;
              }
            }, this.lazyDelayShow);
          } else {
            this.lazyShow = false;
          }
        });
        this.intersection.observe(this.$refs.wrapper);
      } else {
        this.loadImage(this.src);
        this.lazyShow = this.lazyOnce = true;
      }
    },
    loadImage(url){
      if(this.lazyOnce)return;
      const img=new Image();
      img.onload=()=>{
        this.success();
      }
      img.onerror=()=>this.this.error();
      img.src=url;
    }
  },
  async mounted() {
    if (this.aspectRatio) {
      const width = this.getWidth() || 0;
      this.height = width * this.aspectRatio + "px";
    } else {
      this.height = "100%";
    }
    this.loading = true;
    this.watchIntersection();
  },
  deactivated() {
    this.intersection && this.intersection.disconnect();
  },
  activated() {
    this.watchIntersection();
  },
  beforeDestroy() {
    this.intersection && this.intersection.disconnect();
  },
};
</script>

<style scoped></style>