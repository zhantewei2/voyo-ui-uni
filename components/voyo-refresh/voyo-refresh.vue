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

    <!-- #ifdef MP-WEIXIN -->
    <view
      @touchmove="controller.touchmove"
      @touchstart="controller.touchstart"
      @touchend="controller.touchend"
      @touchcancel="controller.touchend"
      @animationend="controller.animationend"
      class="voyo-refresh-wrapper"
      id="voyo-refresh-wrapper"
    >
      <slot></slot>
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view>
      <view
        @touchmove="controller.touchmove"
        @touchstart="controller.touchstart"
        @touchend="controller.touchend"
        @touchcancel="controller.touchend"
        class="voyo-refresh-wrapper"
        id="voyo-refresh-wrapper"
      >
        <slot></slot>
      </view>
    </view>
    <!--    #endif-->
  </view>
</template>
<script src="./voyo-refresh.wxs" lang="wxs" module="controller"></script>
<script src="./voyo-refresh.js"></script>
<style lang="scss"></style>
