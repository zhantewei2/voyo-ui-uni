<template>
  <movable-area
    scroll-x="true"
    class="voyo-tab-bar-container"
    :scroll-with-animation="true"
  >
    <movable-view
      class="voyo-tab-bar-area"
      direction="horizontal"
      inertia="true"
      out-of-bounds="true"
      :class="[borderDict[border] || '']"
      :x="scrollLeft"
      :style="{
        width: moveViewWidth,
      }"
    >
      <slot></slot>
      <div
        v-show="thumb"
        class="voyo-tab-bar-thumb"
        :style="{ transform: 'translate3d(' + thumbLeft + 'px,0,0)' }"
      >
        <div class="voyo-tab-bar-thumb-change"></div>
      </div>
    </movable-view>
  </movable-area>
</template>
<script>
import { of, forkJoin, merge } from "rxjs";
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    thumb: {
      type: Boolean,
      default: true,
    },
    border: {
      type: String,
      default: "bottom",
    },
    /**
     * if use it standAlone..must be specify true
     */
    standAlone: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value: {
      // immediate: true,
      handler(v) {
        if (v === this.currentIndex) return;
        this.setIndex(v);
      },
    },
  },
  data() {
    /**
     * thumbWidth: number;
     * containerWidth: number;
     * untilReadyQueue: [];
     * isReady:boolean
     * tabbarList: voyoTabbar[]
     * preTabbar :voyoTabbar
     */
    return {
      componentName: "voyo-tabbars",
      thumbLeft: 0,
      scrollLeft: 0,
      borderDict: {
        top: "borderTop",
        bottom: "borderBottom",
      },
      /**
       *  interface ItemRef {
       *     index:number;
       *     left:number;
       *     width:number;
       *     thumbLeft:number;
       *     scrollLeft:number;
       * }
       *
       */
      itemListRef: [],
      moveViewWidth: "100%",
      currentIndex: null,
    };
  },
  created() {
    if (this.standAlone) this.setIndex(this.value);
  },
  mounted() {
    this.tabbarList = this.$children.filter(
      (vNode) => vNode.$data.componentName === "voyo-tabbar",
    );

    uni
      .createSelectorQuery()
      .in(this)
      .select(".voyo-tab-bar-container")
      .boundingClientRect()
      .select(".voyo-tab-bar-thumb")
      .boundingClientRect()
      .exec(([containerRect, thumbRect]) => {
        this.thumbWidth = thumbRect.width;
        this.containerWidth = containerRect.width;
        forkJoin(
          this.tabbarList.map((i) =>
            i.mountedComplete ? of(true) : i.mountedSubject,
          ),
        ).subscribe((res) => {
          if (res.every((i) => !!i)) {
            let thumbLeftTotal = 0;
            let itemWidth;
            let scrollLeft;
            let maxScrollLeft;

            this.tabbarList.forEach((vNode, index) => {
              itemWidth = vNode.$data.width;
              this.itemListRef.push({
                index,
                width: itemWidth,
                left: thumbLeftTotal,
                thumbLeft: thumbLeftTotal + itemWidth / 2 - this.thumbWidth / 2,
              });
              thumbLeftTotal += itemWidth;
              vNode.tabbarIndex = index;
            });
            //scroll position
            maxScrollLeft = thumbLeftTotal - this.containerWidth;
            this.itemListRef.forEach((itemRef) => {
              scrollLeft =
                itemRef.left - this.containerWidth / 2 + itemRef.width / 2;
              if (scrollLeft < 0) scrollLeft = 0;
              if (scrollLeft > maxScrollLeft) scrollLeft = maxScrollLeft;
              itemRef.scrollLeft = scrollLeft;
            });
            this.moveViewWidth = thumbLeftTotal + "px";
            //ready
            this.readyEnd();
            this.isReady = true;
            merge(...this.tabbarList.map((i) => i.tapSubject)).subscribe(
              (tabbar) => {
                this.setIndex(tabbar.tabbarIndex);
              },
            );
          }
        });
      });
    // until tabbar mounted end.
    /**
     * uniapp child mounted < parent mounted;
     */
  },
  methods: {
    setIndex(index) {
      this.untilReady(() => {
        if (index === this.currentIndex) return;
        this.currentIndex = index;
        this.setThumb(index);
        this.setScrollView(index);
        this.setTabbar(index);
        this.$emit("input", index);
      });
    },
    setThumb(index) {
      this.thumbLeft = this.itemListRef[index].thumbLeft;
    },
    setScrollView(index) {
      const target = this.itemListRef[index].scrollLeft;
      if (target === this.scrollLeft) return;
      this.scrollLeft = 0 - target;
    },
    setTabbar(index) {
      const currentTabbar = this.tabbarList[index];
      if (currentTabbar === this.preTabbar) return;
      if (this.preTabbar) {
        this.preTabbar.toDisActive();
      }
      currentTabbar.toActive();
      this.preTabbar = currentTabbar;
    },
    untilReady(cb) {
      this.untilReadyQueue = this.utilReadyQueue || [];
      if (this.isReady) {
        cb();
      } else {
        this.untilReadyQueue.push(cb);
      }
    },
    readyEnd() {
      if (this.untilReadyQueue) this.untilReadyQueue.forEach((fn) => fn());
    },
  },
};
</script>
<style lang="scss">
@import "./voyo-tabbars.scss";
</style>
