<template>
  <view
    id="ripple-wrapper"
    @touchstart="touchStart"
    @touchend="touchEnd"
    @touchcancel="touchEnd"
    ref="wrapper"
    :class="['ripple-wrapper', className, wrapperActive ? 'ripple-active' : '']"
  >
    <view
      :style="{ top: i.y, left: i.x, fontSize: i.size }"
      class="ripple-bubbling"
      v-for="i in rippleList"
      :key="i.index"
    ></view>
  </view>
</template>

<script lang="js">
import {getClientRect} from "../utils/getClientRect";
export default {
  props:{
    "css":{
      type:String
    },
    "theme":{
      //deep|light
      type:String,
      default:'light'
    }
  },
  computed:{
    className(){
      return this.css||(this.theme==="deep"?"ripple-wrapper-deep":"ripple-wrapper-light")
    }
  },
  data(){
    return {
      isShow:false,
      rippleList:[],
      currentRipple:{},
      rippleHalfSize:16/2, // ripple font size default
      rippleIndex:0,
      wrapperActive:false,
      wrapperLeaveTimeout:null,
      wrapperLeaveDelay:400,
      rippleLeaveDuration:400,
      defaultRippleSize:30,
    }
  },
  methods:{
    touchStart(e){
      const touchEvent=e.touches[0];
      uni.createSelectorQuery()
              .in(this)
              .select('#ripple-wrapper')
              .boundingClientRect()
              .exec(([client])=>{
                const {top,left,width}=client;
                this.createRipple(
                        touchEvent.clientX-left-this.rippleHalfSize+"px",
                        touchEvent.clientY-top-this.rippleHalfSize+"px",
                        this.autoSizeByWidth(width)+"px"
                );
              })
      this.wrapperStart();
      this.callbackStart();
    },
    createRipple(x,y,size){
      const index=++this.rippleIndex;
      const ripple=this.currentRipple={
        x,
        y,
        size,
        index,
        destroy:()=>this.clearRipples()
      };
      this.rippleList.push(ripple);
      ripple.destroy();
    },
    clearRipples(){
      if(this.clearRipplesTimeout)clearTimeout(this.clearRipplesTimeout);
      this.clearRipplesTimeout=setTimeout(()=>{
        this.rippleList=[];
        this.clearRipplesTimeout=null;
      },this.rippleLeaveDuration);
    },
    autoSizeByWidth(width){
      return width?width/6:this.defaultRippleSize
    },
    touchEnd(e){
      this.callbackEnd();
      this.wrapperLeave();
    },
    wrapperStart(){
      this.wrapperActive=true;
    },
    wrapperLeave(){
      if(this.wrapperLeaveTimeout)clearTimeout(this.wrapperLeaveTimeout);
      this.wrapperLeaveTimeout=setTimeout(()=>{
        this.wrapperActive=false;
        this.wrapperLeaveTimeout=null;
      },this.wrapperLeaveDelay)
    },
    callbackStart(){
      this.$emit("callback",true);
    },
    callbackEnd(){
      this.$emit("callback",false);
    }
  },
  mounted(){}
}
</script>
<style lang="scss"></style>
