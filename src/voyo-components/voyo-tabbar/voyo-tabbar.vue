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
import {querySelector} from "../utils/querySelector";
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
    //小程序需要延迟才能正确获取rect
    setTimeout(()=>{
      querySelector(
          ()=>uni.createSelectorQuery().in(this).select("#voyo-tabbar-item").boundingClientRect(),
          ([rect])=>rect&&rect.width
      ).then(([res]) => {
            this.width = res.width;
            this.mountedSubject.next((this.mountedComplete = true));
            this.mountedSubject.complete();
          });  
    })
    
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
