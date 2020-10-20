<template>
  <view
      id="img-container"
      ref="imgContainer"
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
        height: imgHeight===0||imgHeight? (imgHeight + 'px') : '' ,
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
  import { systemInfo,platform ,isH5} from "../utils/common";

  export default {
    data() {
      return {
        value: "",
        imgHeight: null,
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
        default:false
      },
      lazyList:{
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
      watchIntersection() {
        if (!isH5) {
          this.miniIntersectionObserver = this.createIntersectionObserver();
          this.miniIntersectionObserver.relativeToViewport({
            bottom: 50
          })
          this.miniIntersectionObserver.observe(".voyo-img-container", entry => {
            this.imageLoadStart();
            this.miniIntersectionObserver.disconnect();
          })
        }else{
          this.lazyListAncestor.observe(this.$refs['imgContainer'].$el,({visible,unsubscribe})=>{
            if(visible){
              this.imageLoadStart();
              unsubscribe();
            }
          }).then((order)=>this.h5IntersectionOrder=order);
        }
      }
    },
    beforeCreate() {
      this.viewWidth = 0;
      this.excuteAfterGetRect = new ExcuteAfterConnected();
      this.readyValue = "";
      this.visible0 = true;
      this.rectTop=0;
      this.ancestorLazyListName="voyo-img-lazy-list";
      this.miniIntersectionObserver=null;
      this.h5IntersectionOrder=null;
    },
    created() {
      if (this.imgWidth) {
        this.calHeight(this.imgWidth);
      }
      if(this.aspect)this.imgHeight=0;
    },
    mounted() {
      this.lazyListAncestor=null;

      if(this.lazyList){
        this.lazyListAncestor=this.findLazyListAncestor(this);
        if(!this.lazyListAncestor)return;
        this.lazyListAncestor.descendantRegistry();
        this.lazyListAncestorCompleteOrder=this.lazyListAncestor.lazyDescendantComplete.subscribe(()=>{
          this.watchIntersection();
          // this.lazyListAncestorCompleteOrder.unsubscribe();
        })
      }
      if (!this.imgWidth && (this.aspect || this.autoHeight)) {
        setTimeout(()=>{
          uni
            .createSelectorQuery()
            .in(this)
            .select("#img-container")
            .boundingClientRect()
            .exec(([rect]) => {
              this.calHeight(rect.width);
              if(this.lazyList&&this.lazyListAncestor)this.lazyListAncestor.descendantInitComplete();
            });
        })
      }
    },
    beforeDestroy() {
      try{
        this.miniIntersectionObserver&&this.miniIntersectionObserver.disconnect();
        this.h5IntersectionOrder&&this.h5IntersectionOrder.unsubscribe();
      }catch (e) {}
    }
  };
</script>

<style scoped></style>