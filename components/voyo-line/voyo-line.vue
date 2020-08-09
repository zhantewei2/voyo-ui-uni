<template>
  <view class="voyo-line" @touchstart="line.start" @touchend="line.end">
    <view
      class="voyo-line-content"
      :class="[disableBorder ? '.__disableBorder' : '']"
    >
      <span class="voyo-line-cell">
        <span v-if="$slots.leftIcon" class="_leftIcon">
          <slot name="leftIcon"></slot>
        </span>
        <span class="_left">
          <slot name="left"></slot>
        </span>
      </span>
      <span class="voyo-line-cell">
        <span class="_right">
          <slot name="right"></slot>
        </span>
        <span v-if="$slots.rightIcon" class="_rightIcon">
          <slot name="rightIcon"></slot>
        </span>
      </span>
    </view>
    <view
      id="voyo-line-hover"
      class="ripple-wrapper ripple-wrapper-light"
    ></view>
  </view>
</template>
<script module="line" lang="wxs">
var start=function(e,ins){
  ins.selectComponent("#voyo-line-hover").addClass("ripple-active");
};
var end=function(e,ins){
  ins.selectComponent("#voyo-line-hover").removeClass("ripple-active");
};
var bb=function(){
  return {
    name:1
  }
};
module.exports={
  start:start,
  end:end
}
</script>
<script>
export default {
  data() {
    return {
      showLeftIcon: false,
      showRightIcon: false,
    };
  },
  props: {
    ripple: {
      type: Boolean,
      default: false,
    },
    disableBorder: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
:host {
  display: block;
}
</style>
