<template>
  <view>
    <movable-area
      class="voyo-sidebar-area"
      :scroll-width-animation="true"
      scroll-y="true"
    >
      <movable-view
        class="voyo-sidebar-view"
        direction="vertical"
        inertia="true"
        out-of-bounds="true"
        :y="scrollTop"
        :style="{
          height: viewHeight + 'px',
        }"
      >
        <slot></slot>
        <view
          class="voyo-sidebar-thumb"
          id="voyo-sidebar-thumb"
          :style="{
            top: thumbTop + 'px',
          }"
          :class="[thumbTop ? '' : '__hide']"
        ></view>
      </movable-view>
    </movable-area>
  </view>
</template>
<script>
import { forkJoin, of, Observable, merge } from "rxjs";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    index: {
      immediate: true,
      handler(v) {
        this.setIndex(v);
      },
    },
  },
  data() {
    return {
      scrollTop: 0,
      /**
       * itemRef{
       *     height:number;
       *     thumbTop:number;
       *     index:number;
       * }
       */
      itemRefList: [],
      thumbTop: 0,
      viewHeight: 0,
    };
  },
  beforeCreate() {
    this.excuteAfterConnected = new ExcuteAfterConnected();
    this.itemList = null;
    this.sideItemPre = null;
    this.currentIndex = null;
  },
  mounted() {
    const sideItemList = (this.itemList = this.$children.filter(
      (componentInstance, index) => {
        if (componentInstance.$data.componentName === "voyo-sidebar-item") {
          componentInstance.sideIndex = index;
          return true;
        }
      },
    ));
    let thumbHeight = 0;
    const subList = sideItemList
      .map((item) =>
        item.$data.mountedComplete ? of(true) : item.mountedSubject,
      )
      .concat([
        new Observable((ob) => {
          uni
            .createSelectorQuery()
            .in(this)
            .select("#voyo-sidebar-thumb")
            .boundingClientRect()
            .exec(([rect]) => {
              thumbHeight = rect.height;
              ob.next(true);
              ob.complete();
            });
        }),
      ]);
    forkJoin(subList).subscribe(() => {
      let top = 0;
      let itemHeight;
      sideItemList.forEach((i, index) => {
        itemHeight = i.$data.height;
        this.itemRefList.push({
          index,
          height: itemHeight,
          thumbTop: (itemHeight - thumbHeight) / 2 + top,
        });
        top += itemHeight;
      });
      this.viewHeight = top;
      this.excuteAfterConnected.connect();
    });
    merge(...sideItemList.map((i) => i.tapSubject)).subscribe((tapIndex) => {
      this.setIndex(tapIndex);
    });
  },
  methods: {
    setIndex(v) {
      this.excuteAfterConnected.execute(() => {
        if (v === this.currentIndex) return;
        const activeItemRef = this.itemRefList[v];
        const activeItem = this.itemList[v];
        if (!activeItemRef) return;
        if (this.sideItemPre) this.sideItemPre.disActive();
        activeItem.toActive();
        this.thumbTop = activeItemRef.thumbTop;
        this.sideItemPre = activeItem;
        this.currentIndex = v;
        this.$emit("indexChange", v);
      });
    },
  },
};
</script>
<style lang="scss"></style>
