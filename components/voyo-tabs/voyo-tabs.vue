<template>
  <view
    :style="{
      position: 'relative',
      height: height ? height + 'px' : '100%',
    }"
  >
    <slot></slot>
  </view>
</template>
<script>
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
import { Subject, merge } from "rxjs";
import { isH5 } from "../utils";
export default {
  props: {
    height: {
      type: Number,
    },
    index: {
      type: Number,
      default: 0,
    },
    immediateIndex: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      componentName: "voyo-tabs",
    };
  },
  watch: {
    index: {
      // immediate: true,
      handler(v) {
        this.selectActiveTab(v);
      },
    },
  },
  /**
   * scrollSubject: Subject< {top:number,height:number,index:number} >
   * excuteAfterConnected : ExcuteAfterConnected
   * activeIndex: number;
   * preActiveTab : VoyoTabComponent;
   * tabList:  VoyoTabComponent[];
   * tabStatList : Array<{tabIndex,top:number,tab:VoyoTabComponent}>
   */
  beforeCreate() {
    this.excuteAfterConnected = new ExcuteAfterConnected();
    this.scrollSubject = new Subject();
    this.tabStatList = [];
  },
  mounted() {
    let tabIndex = 0;
    this.tabList = (
      isH5?
      this.$slots.default.map(i=>i.componentInstance):
      this.$children
    ).filter((componentInstance) => {
      if (componentInstance.$data.componentName === "voyo-tab") {
        componentInstance.tabIndex = tabIndex;
        this.tabStatList.push({ tabIndex, top: 0, tab: componentInstance });
        tabIndex++;
        return true;
      }
    });
    this.listenTabsScroll();
    this.excuteAfterConnected.connect();
    if (this.immediateIndex) this.selectActiveTab(this.index);
  },
  methods: {
    listenTabsScroll() {
      let index;
      let top;
      let height;
      merge(...this.tabList.map((tab) => tab.scrollEvent)).subscribe(
        ({ event, tab }) => {
          index = tab.tabIndex;
          top = event.detail.scrollTop;
          height = event.detail.scrollHeight;
          this.tabStatList[0].top = top;
          this.scrollSubject.next({ index, top, height });
        },
      );
    },
    selectActiveTab(index) {
      this.excuteAfterConnected.execute(() => {
        if (index === this.activeIndex) return;
        this.activeIndex = index;
        const nextTab = this.tabList[index];
        if (this.preActiveTab) this.preActiveTab.clearActive();
        nextTab.toActive(
          this.tabStatList &&
            this.tabStatList[index] &&
            this.tabStatList[index].top,
        );
        this.preActiveTab = nextTab;
      });
    },
    mountedPromise() {
      return new Promise((resolve, reject) => {
        this.excuteAfterConnected.execute(() => resolve());
      });
    },
    disableScroll() {
      this.excuteAfterConnected.execute(() => {
        this.tabList.forEach((tab) => tab.disableScroll());
      });
    },
    enableScroll() {
      this.excuteAfterConnected.execute(() => {
        this.tabList.forEach((tab) => tab.enableScroll());
      });
    },
  },
};
</script>
<style lang="scss"></style>
