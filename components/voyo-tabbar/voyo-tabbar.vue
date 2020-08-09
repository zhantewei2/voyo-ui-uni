<template>
  <view
    id="voyo-tabbar-item"
    class="voyo-tabbar-item"
    :class="[active ? '__active' : '']"
    @tap="tap"
  >
    <slot></slot>
    <voyo-ripple v-if="ripple"></voyo-ripple>
  </view>
</template>
<script>
import { Subject } from "rxjs";

export default {
  data() {
    return {
      componentName: "voyo-tabbar",
      width: 0,
      active: false,
    };
  },
  props: {
    ripple: {
      default: true,
      type: Boolean,
    },
  },
  created() {
    this.mountedComplete = false;
    this.mountedSubject = new Subject();
    this.tapSubject = new Subject();
    this.tabbarIndex = null;
  },
  mounted() {
    uni
      .createSelectorQuery()
      .in(this)
      .select("#voyo-tabbar-item")
      .boundingClientRect()
      .exec(([res]) => {
        this.width = res.width;
        this.mountedSubject.next((this.mountedComplete = true));
        this.mountedSubject.complete();
      });
  },
  methods: {
    tap() {
      this.tapSubject.next(this);
    },
    toActive() {
      this.active = true;
    },
    toDisActive() {
      this.active = false;
    },
  },
};
</script>
<style lang="scss">
@import "./voyo-tabbar.scss";
</style>
