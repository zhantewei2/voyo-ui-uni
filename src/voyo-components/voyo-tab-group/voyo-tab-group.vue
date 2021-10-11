<template>
  <view :class="[
    page=='inner' ? 'voyo-tab-page' : '',
    page=='page' ? 'voyo-page':'',
    gentle ? 'gentle' : '']"
  >
    <slot></slot>
  </view>
</template>
<script>
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
import {isH5} from "../utils";
export default {
  /**
   * activeIndex: number
   * tabbars
   * tabs
   * excuteAfterConnected : ExcuteAfterConnected
   */
  data() {
    return {
      componentName: "voyo-tab-group",
    };
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    page: {
      type: String, // page|inner
      default: "inner",
    },
    gentle: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    index: {
      immediate: true,
      handler(v) {
        this.setIndex(v);
      }
    },
  },
  beforeCreate() {
    this.excuteAfterConnected = new ExcuteAfterConnected();
  },
  mounted() {
    
    if(isH5){
      this.$slots.default.forEach((i) => {
        const componentInstance=i.componentInstance;
        const componentName=i.componentInstance.$data.componentName;
        if (componentName === "voyo-tabs") this.tabs = componentInstance;
        if (componentName === "voyo-tabbars") this.tabbars = componentInstance;
      });
    }else{
      this.$children.forEach((i)=>{
        const componentName=i.$data.componentName;
        if (componentName === "voyo-tabs") this.tabs = i;
        if (componentName === "voyo-tabbars") this.tabbars = i;
      })
    }
    
    if (!this.tabs || !this.tabbars)
      throw new Error("A lack of tabs or tabbars");
    this.tabbars.$on("input", (index) => {
      this.setIndex(index);
    });

    this.excuteAfterConnected.connect();
  },
  methods: {
    setIndex(v) {
      this.excuteAfterConnected.execute(() => {
        if (v === this.activeIndex) return;
        this.activeIndex = v;
        this.tabs && this.tabs.selectActiveTab(v);
        this.tabbars && this.tabbars.setIndex(v);
        this.$emit("input", v);
      });
    },
    listenTabbarsChange(e) {},
    mountedPromise() {
      return new Promise((resolve, reject) => {
        this.excuteAfterConnected.execute(() => resolve());
      });
    },
  },
};
</script>
<style lang="scss"></style>
