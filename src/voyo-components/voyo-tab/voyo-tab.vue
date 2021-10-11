<template>
  <view>
    <scroll-view
        v-if="initContent"
        id="scrollView"
        ref="scrollView"
        :scroll-top="upperPosition"
        :scroll-y="canScrollAll"
        :style="[
        height0 ? { height: height0 + 'px' } : null,
        showContent ? { display: 'block' } : { display: 'none' },
      ]"
        :class="['abs-full', gentle ? 'voyo-bg-gentle' : '']"
        @scroll="onScroll"
        :enhanced="true"
        :bounces="iosBounces"
    >
      <!--      <view class="voyo-pagination-refresher"> </view>-->
      <view
          class="voyo-pagination-content"
          data-voyo-type="voyo-tab-slot-wrapper"
          v-if="(cache === 'instance' && showContent) || cache !== 'instance'"
      >
        <slot></slot>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import {merge, Observable, of, Subject,timer,interval} from "rxjs";
import {ExcuteAfterConnected} from "../utils";
import {isTabsParent} from "../utils/findComponent";
import {debounceTime, map, mergeMap,debounce,retry} from "rxjs/operators";

export default {
  /**
   *
   * scrollSubject :Subject<{event:Event,tab:this}>
   * tabIndex
   * canScroll
   */
  data() {
    return {
      componentName: "voyo-tab",
      height0: 0,
      tabActive: false, //inner tab active,
      tabInit: false,
      canScroll: true,
      canScrollByOther: true,
      upperThreshold: 0,
      lowerThreshold: 60,
      refresherTriggered: false,
      refreshing: false,
      retryEnabled: false,
      usePagination: true, //tmp true
      isScrollUpperBound: true,
      innerUpperBehavior: false,
      upperPosition:0,
    };
  },
  props: {
    iosBounces:{
      type:Boolean,
      default :false
    },
    isInner: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
    },
    initLoad: {
      type: Boolean,
      default: true,
    },
    gentle: {
      type: Boolean,
      default: false,
    },
    refresh: {
      type: Boolean,
      default: false,
    },
    cache: {
      type: String, // 'dom'|'instance'
      default: "dom",
    },
  },
  computed: {
    showContent() {
      return (this.isInner && this.tabActive) || !this.isInner;
    },
    initContent() {
      return (this.isInner && this.tabInit) || !this.isInner;
    },
    canScrollAll() {
      return !this.refreshing && this.canScroll && this.canScrollByOther;
    },
    refresherEnabled() {
      return (
          this.refreshing ||
          (this.refresh && this.canScroll && this.canScrollByOther)
      );
    },
  },
  watch: {
    height: {
      immediate: true,
      handler(v) {
        this.setHeight(v);
      },
    },
    initContent:{
      immediate:true,
      handler(v) {
        v && this.contentExcute.connect();
      }},
  },
  beforeCreate() {
    this.scrollSubject = new Subject();
    this.scrollAreaHeight = null;
    this.scrollTop = null;
    this.scrollHeight = null;
    this.contentExcute = new ExcuteAfterConnected();

    let nodeRefsScrollOffset = uni
        .createSelectorQuery()
        .in(this)
        .select("#scrollView")
        .scrollOffset();
    this.scrollEvent=new Subject();
    let scrollH5Container;

    this.scrollBetterSubject = merge(
        of({
          detail:{scrollTop:0}
        }),
        this.scrollSubject,
        this.scrollSubject.pipe(
            debounceTime(150),
            mergeMap(
                () =>
                    new Observable((ob) => {
                      // #ifdef MP-WEIXIN
                      nodeRefsScrollOffset.exec(([r]) => {
                        ob.next({ type: "scroll", detail: r });
                        ob.complete();
                      });
                      // #endif

                      // #ifdef ENV-H5
                      if(!scrollH5Container){
                        const scrollViewEl=this.$refs.scrollView.$el;
                        scrollH5Container=scrollViewEl.querySelector(".uni-scroll-view>.uni-scroll-view");
                      }
                      ob.next({
                        type:"scroll",
                        detail:{
                          scrollTop: scrollH5Container.scrollTop,
                          scrollHeight: scrollH5Container.scrollHeight
                        }
                      })
                      ob.complete();
                      // #endif
                    }),
            ),
        ),
    ).pipe(
        map((event) => ({
          tab: this,
          event,
        })));
    
    this.sub=this.scrollBetterSubject.subscribe(i=>this.scrollEvent.next(i))
  },
  mounted() {
    let detail;
    let isBottom = false;
    let bottomHeight;
    let bottomMinHeight;
    this.touchStartY = 0;
    this.scrollEvent.subscribe(async ({ event }) => {
      if (!this.usePagination||!event||!event.detail) return;
      detail=event.detail;
      if(!detail.scrollHeight)return;
      const viewHeight = await this.getViewHeight();
      bottomHeight = detail.scrollHeight - detail.scrollTop;
      bottomMinHeight = viewHeight + this.lowerThreshold;
      //scrolltolower
      if (bottomHeight <= bottomMinHeight && !isBottom) {
        isBottom = true;
        this.$emit("scrolltolower", true);
      } else if (bottomHeight > bottomMinHeight && isBottom) {
        isBottom = false;
      }
    });
    // if(this.isInner){
    //   const tabs=isTabsParent(this);
    //   if(!tabs)console.error("tabs none exists");
    //   tabs.registryTab(this);
    // }
    
  },
  methods: {
    toUpper(){
      this.upperPosition=this.upperPosition===0?1:0;
    },
    getScrollTop() {
      return this.scrollTop;
    },
    touchstart(e) {
      if (!this.canScroll) return;
      this.touchStartY = e.pageY;
    },
    touchmove(e) {
      if (!this.canScroll) return;
      if (this.touchStartY - e.pageY > 30) this.innerUpperBehavior = true;
    },
    touchend(e) {
      this.innerUpperBehavior = false;
    },
    scrollIsEnd() {},
    onScroll(e) {
      if (this.innerUpperBehavior) {
        e.stopPropagation();
      }
      this.scrollSubject.next(e);
    },
    reCalViewHeight(){
      this.scrollAreaHeight=0;
    },
    getViewHeight() {
      return new Promise((resolve, reject) => {
        if (this.scrollAreaHeight) return resolve(this.scrollAreaHeight);
        this.contentExcute.execute(() => {
          this.createSelectorQuery()
              .in(this)
              .select(" #scrollView")
              .boundingClientRect()
              .exec(([rect]) => {
                resolve((this.scrollAreaHeight = Math.floor(rect.height)));
              });
        });
      });
    },
    setHeight(h) {
      if (h === this.height0) return;
      this.height0 = h;
    },
    clearActive() {
      this.tabHide();
      this.tabActive = false;
    },
    toActive() {
      this.tabShow();
      this.tabInit = this.tabActive = true;
    },
    tabHide() {
      this.$emit("hide", true);
      //view scroll 在隐藏后，refresherEnable 置为true 时，会不生效。
      // 所以 所有隐藏前均置为true
      this.retryEnabled = true;
    },
    tabShow() {
      this.retryEnabled = false;
      this.$emit("show", true);
    },
    viewScroll(event) {
      // this.scrollTop = event.detail.scrollTop;
      // this.scrollHeight = event.detail.scrollHeight;
      // this.$emit("scroll", event);
    },
    disableScroll() {
      if (!this.canScroll) return;
      this.canScroll = false;
    },
    enableScroll() {
      if (this.canScroll) return;
      this.canScroll = true;
    },
    disableScrollUnOfficial() {
      if (!this.canScrollByOther) return;
      this.canScrollByOther = false;
    },
    enableScrollUnOfficial() {
      if (this.canScrollByOther) return;
      this.canScrollByOther = true;
    },
    scrollToUpper() {
      this.$emit("scrolltoupper", true);
    },
    refresherrefresh() {
      if (this.refreshing) return;
      this.refresherTriggered = this.refreshing = true;
      this.$emit("refresherTriggered", () => {
        this.refresherTriggered = false;
      });
    },
    refresherpulling(e) {
      this.refresherTriggered = true;
    },
    refresherrestore(e) {
      this.refresherTriggered = this.refreshing = false;
    },
  },
};
</script>
<style lang="scss"></style>
