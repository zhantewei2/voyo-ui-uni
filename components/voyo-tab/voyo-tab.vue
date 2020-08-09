<template>
  <view>
    <scroll-view
      v-if="initContent"
      id="scrollView"
      :scroll-y="canScrollAll"
      :style="[
        height0 ? { height: height0 + 'px' } : null,
        showContent ? { display: 'block' } : { display: 'none' },
      ]"
      :class="['abs-full', gentle ? 'voyo-bg-gentle' : '']"
      @scroll="onScroll"
    >
      <!--      <view class="voyo-pagination-refresher"> </view>-->

      <view
        class="voyo-pagination-content"
        v-if="(cache === 'instance' && showContent) || cache !== 'instance'"
      >
        <slot></slot>
      </view>
    </scroll-view>
  </view>
</template>
<script src="./voyo-tab-js.js"></script>
<style lang="scss"></style>
