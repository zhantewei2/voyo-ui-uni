<template>
  <scroll-view
    id="voyo-tab-page"
    :scroll-y="enableScroll"
    class="voyo-tab-page"
    @scroll="scroll"
  >
    <view class="voyo-tab-page-container">
      <slot></slot>
    </view>
  </scroll-view>
</template>
<script>
import { TabGroupName, findFromList, TabsName } from "../utils/findComponent";
import { systemInfo } from "../utils";
import { Subject, merge, Observable } from "rxjs";
import { debounceTime, mergeMap } from "rxjs/operators";

export default {
  /**
   * pageTop
   * pageHeight
   * scrollTop
   * scrollHeight
   * scrollMax
   * tabGroup
   * tabs
   * tabsScrollIsDisabled
   * scrollChange
   * scrollChangeAll
   */
  data() {
    return {
      enableScroll: true,
    };
  },
  props: {
    // distance to the bottom of scroll
    bottomDistance: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.pageTop = 0;
    this.scrollTop = 0;
    this.pageHeight = 0;
    this.scrollChange = new Subject();
    this.scrollChangeAll = merge(
      this.scrollChange,
      this.scrollChange.pipe(
        debounceTime(200),
        mergeMap((e) => {
          return new Observable((ob) => {
            uni
              .createSelectorQuery()
              .in(this)
              .select(".voyo-tab-page-container")
              .boundingClientRect()
              .exec(([rect]) => {
                e.detail.scrollTop = 0 - rect.top + this.pageTop;
                ob.next(e);
              });
          });
        }),
      ),
    );
    this.scrollChangeAll.subscribe((e) => this.listenScroll(e));
  },
  mounted() {
    uni
      .createSelectorQuery()
      .in(this)
      .select("#voyo-tab-page")
      .boundingClientRect()
      .exec(([rect]) => {
        this.pageTop = rect.top;
        this.pageHeight = rect.height;
      });
    this.findTabbars().then(() => {
      this.initCheckScroll();
    });
  },
  methods: {
    /**
     * find from primary level
     * @returns {Promise<void>}
     */
    async findTabbars() {
      const children = this.$children;
      this.tabs = findFromList(children, TabsName);
      this.tabGroup = findFromList(children, TabGroupName);
      if (!this.tabs && this.tabGroup) {
        await this.tabGroup.mountedPromise();
        this.tabs = findFromList(this.tabGroup.$children, TabsName);
      }
    },
    scroll(e) {
      this.scrollChange.next(e);
    },
    initCheckScroll() {
      // wait all children mounted
      setTimeout(() => {
        uni
          .createSelectorQuery()
          .in(this)
          .select(".voyo-tab-page-container")
          .boundingClientRect()
          .exec(([rect]) => {
            this.listenScroll({
              detail: { scrollTop: 0, scrollHeight: Math.floor(rect.height) },
            });
          });
      });
    },

    listenScroll(e) {
      this.scrollTop = e.detail.scrollTop;
      this.scrollHeight = e.detail.scrollHeight;
      this.scrollMax = Math.floor(
        this.scrollHeight - this.pageHeight - this.bottomDistance,
      );
      if (this.scrollTop >= this.scrollMax && this.tabsScrollIsDisabled) {
        this.tabsScrollIsDisabled = false;
        this.tabs && this.tabs.enableScroll();
        console.debug("page scroll", "tabs enable scroll");
      } else if (
        this.scrollTop < this.scrollMax &&
        !this.tabsScrollIsDisabled
      ) {
        this.tabsScrollIsDisabled = true;
        this.tabs && this.tabs.disableScroll();
        console.debug("page scroll", "tabs disable scroll");
      }
    },
  },
};
</script>
<style lang="scss"></style>
