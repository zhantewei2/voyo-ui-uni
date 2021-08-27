<template>
  <view
    id="voyo-sidebar-item"
    class="voyo-sidebar-item"
    :class="[active ? 'active' : '']"
    @tap="tap"
  >
    <slot></slot>
  </view>
</template>
<script>
import { Subject } from "rxjs";

export default {
  data() {
    return {
      mountedComplete: false,
      componentName: "voyo-sidebar-item",
      height: 0,
      active: false,
    };
  },
  beforeCreate() {
    this.mountedSubject = new Subject();
    this.tapSubject = new Subject();
    this.sideIndex = 0;
  },
  mounted() {
    uni
      .createSelectorQuery()
      .in(this)
      .select("#voyo-sidebar-item")
      .boundingClientRect()
      .exec(([rect]) => {
        this.height = rect.height;
        this.mountedSubject.next((this.mountedComplete = true));
        this.mountedSubject.complete();
      });
  },
  methods: {
    toActive() {
      this.active = true;
    },
    disActive() {
      this.active = false;
    },
    tap() {
      this.tapSubject.next(this.sideIndex);
    },
  },
};
</script>
<style lang="scss"></style>
