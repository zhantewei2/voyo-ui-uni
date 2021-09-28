<template>
  <view
      class="rel"
      :canRefreshVal="canRefresh"
      :initVal="init"
      :change:canRefreshVal="controller.canRefreshChange"
      :change:initVal="controller.initChange"
      :refreshCompleteVal="refreshCompleteValue"
      :change:refreshCompleteVal="controller.refreshCompleteChange"
  >

    <slot name="prefix"></slot>
    <view class="rel">
      <view
          class="voyo-refresh-content"
          :style="{
            height: '80px',
          }"
      >
        <view class="voyo-refresh-content-item" id="refreshItem">
          <image class="_img" :src="refreshItemIcon"></image>
          <text>{{ refreshItemText }}</text>
        </view>
        <view class="voyo-refresh-content-item" id="refreshTriggerItem">
          <image class="_img" :src="refreshTriggerIcon"></image>
          <text>{{ refreshTriggerText }}</text>
        </view>
        <view class="voyo-refresh-content-item" id="refreshRunningItem">
          <image class="_img" :src="refreshRunIcon"></image>
          <text>{{ refreshRunText }}</text>
        </view>
        <view class="voyo-refresh-content-item" id="refreshSuccessItem">
          <image class="_img" :src="refreshSuccessIcon"></image>
          <text>{{ refreshSuccessText }}</text>
        </view>
      </view>
    </view>

    <view
        @touchmove="controller.touchmove"
        @touchstart="controller.touchstart"
        @touchend="controller.touchend"
        @touchcancel="controller.touchend"
        @animationend="controller.animationend"
        class="voyo-refresh-wrapper"
    >
      <slot></slot>
    </view>
    <!--    &lt;!&ndash; #ifdef H5 &ndash;&gt;-->
    <!--    <view>-->
    <!--      <view-->
    <!--        @touchmove="controller.touchmove"-->
    <!--        @touchstart="controller.touchstart"-->
    <!--        @touchend="controller.touchend"-->
    <!--        @touchcancel="controller.touchend"-->
    <!--        class="voyo-refresh-wrapper"-->
    <!--        id="voyo-refresh-wrapper"-->
    <!--      >-->
    <!--        <slot></slot>-->
    <!--      </view>-->
    <!--    </view>-->
    <!--    &lt;!&ndash;    #endif&ndash;&gt;-->
  </view>
</template>
<script lang="js">
import {setting}from "../setting.service";
export default {
  props: {
    enabled: {
      type:Boolean ,
      default:true,
    },
    refreshItemText:{
      type:String,
      default:setting.refresh.itemText
    },
    refreshItemIcon:{
      type:String,
      default:setting.refresh.itemIcon
    },
    refreshTriggerText:{
      type:String,
      default:setting.refresh.triggerText
    },
    refreshTriggerIcon:{
      type:String,
      default:setting.refresh.triggerIcon
    },
    refreshRunText:{
      type:String,
      default:setting.refresh.runText
    },
    refreshRunIcon:{
      type:String,
      default:setting.refresh.runIcon
    },
    refreshSuccessText:{
      type:String,
      default:setting.refresh.successText
    },
    refreshSuccessIcon:{
      type:String,
      default:setting.refresh.successIcon
    }
  },
  computed:{
    canRefresh(){
      return this.enabled&&!this.refreshing;
    }
  },
  data() {
    return {
      refreshing: false,
      init:false,
      refreshCompleteValue:0
    }
  },
  mounted(){
    this.init=true;
  },
  methods:{
    show(...args){
      console.log(...args);
    },
    move(e){
      const touch=e.touches[0];
      console.log("move",touch.pageY);
    },
    refreshStart(){
      this.refreshing=true;
      this.$emit("refreshStart","");
    },
    refreshComplete(){
      this.refreshing=false;
      this.refreshCompleteValue++;
    }
  },
};
</script>
<script src="./voyo-refresh.wxs" lang="wxs" module="controller"></script>
<style lang="scss"></style>