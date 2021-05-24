<template>
  <view id="wrapper" style="overflow: hidden; width: 100%" class="no-wrap">
    <view
        id="container"
        :class="[run ? '__run' : '']"
        class="voyo-marquee-animation"
        :style="{
        animationDuration: duration,
      }"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  beforeCreate() {
    this.v = 40;
  },
  data() {
    return {
      duration: 0,
      run: false,
      anStartStyle: {},
      anEndStyle: {},
    };
  },
  mounted() {
    //动态获取内容宽度
    uni
        .createSelectorQuery()
        .in(this)
        .select("#container")
        .boundingClientRect()
        .select("#wrapper")
        .boundingClientRect()
        .exec(([{ width: containerW }, { width: wrapperW }]) => {
          this.duration = (containerW + wrapperW) / this.v + "s";
          this.run = true;
        });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@keyframes VoyoMarqueeAnimation {
  from {
    transform: translate3d(10%, 0, 0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
.voyo-marquee-animation {
  transform: translate3d(10%, 0, 0);
  display: inline-block;
  &.__run {
    animation-name: VoyoMarqueeAnimation;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
}
</style>
