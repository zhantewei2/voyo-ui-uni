import { Subject, merge, Observable,of } from "rxjs";
import { debounceTime, map, mergeMap } from "rxjs/operators";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";

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
    };
  },
  props: {
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

    this.scrollEvent = merge(
      of({
          detail:{scrollTop:0}
      }),
      this.scrollSubject,
      this.scrollSubject.pipe(
        debounceTime(150),
        mergeMap(
          () =>
            new Observable((ob) => {
              nodeRefsScrollOffset.exec(([r]) => {
                ob.next({ type: "scroll", detail: r });
              });
            }),
        ),
      ),
    ).pipe(
      map((event) => ({
        tab: this,
        event,
      })),
    );
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
  },
  methods: {
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
