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
        :lazy-load="uniLazy"
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
  import { systemInfo } from "../utils/common";

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
        default: "aspectFill",
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
      uniLazy:{
        type:Boolean,
        default:false
      },
      voyoLazyThreshold:{
        type:Number,
        default:-100
      },
      lazyLoad:{
        type:Boolean,
        default:false
      },
      lazyList:{
        type:Boolean,
        default:false
      },
      index:null
    },
    watch: {
      src: {
        handler(v) {
          this.readyValue = v;
          if (this.autoLoad &&!this.lazyLoad) this.imageLoadStart();
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
      findLazyListAncestor(target){
        if(target&&target.$parent){
          if(target.$parent.lazyListComponentName===this.ancestorLazyListName){
            return target.$parent;
          }else{
            return this.findLazyListAncestor(target.$parent);
          }
        }else{
          return null;
        }
      },
      watchIntersection(){
        const intersectionObserver=this.createIntersectionObserver()

        intersectionObserver.relativeToViewport({
          bottom:50
        })
        intersectionObserver.observe(".voyo-img-container",entry=>{
          console.debug("image entry");
          this.imageLoadStart();
          intersectionObserver.disconnect();
        })
      }

    },
    beforeCreate() {
      this.viewWidth = 0;
      this.excuteAfterGetRect = new ExcuteAfterConnected();
      this.readyValue = "";
      this.visible0 = true;
      this.rectTop=0;
      this.ancestorLazyListName="voyo-img-lazy-list";
    },
    created() {
      if (this.imgWidth) {
        this.calHeight(this.imgWidth);
      }
    },

    mounted() {
      let lazyListAncestor;

      if(this.lazyList){
        lazyListAncestor=this.findLazyListAncestor(this);
        if(!lazyListAncestor)return;
        lazyListAncestor.descendantRegistry();
        this.lazyListAncestorCompleteOrder=lazyListAncestor.lazyDescendantComplete.subscribe(()=>{
          this.watchIntersection();
          this.lazyListAncestorCompleteOrder.unsubscribe();
        })
      }

      if (!this.imgWidth && (this.aspect || this.autoHeight)) {
        uni
          .createSelectorQuery()
          .in(this)
          .select("#img-container")
          .boundingClientRect()
          .exec(([rect]) => {
            this.calHeight(rect.width);
            if(this.lazyList&&lazyListAncestor)lazyListAncestor.descendantInitComplete();
          });
      }
    },
  };
</script>

<style scoped></style>