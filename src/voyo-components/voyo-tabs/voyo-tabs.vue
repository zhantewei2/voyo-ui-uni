<template>
  <view
      :style="[
        height?{
          position:'relative',
          height:height+'px'
        }:null
      ]"
  >
    <view v-if="compatibilityFlex1" class="abs-full" data-voyo-type="voyo-tabs-slot-wrapper">
      <slot></slot>
    </view>
    <block else>
      <slot></slot>
    </block>
  </view>
</template>
<script>
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
import { Subject, merge } from "rxjs";
import { isH5} from "../utils";
import { findChildrenFromList,TabName} from "../utils/findComponent";

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
    compatibilityFlex1:{
      type: Boolean,
      default:false
    }
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
    this.tabList=[];
    this.tabCount=0;
  },
  mounted() {
    
    this.tabList = (
        isH5?
            this.$slots.default.map(i=>i.componentInstance):
            this.$children
    ).filter((componentInstance) => {
      if (componentInstance.$data.componentName === "voyo-tab") {
        this.registryTab(componentInstance);
        return true;
      }
    });
    this.listenTabsScroll();
    this.excuteAfterConnected.connect();
    if (this.immediateIndex) this.selectActiveTab(this.index);
  },
  methods: {
    registryTab(tabComponentInstance){
      tabComponentInstance.tabIndex=this.tabCount;
      this.tabList.push(tabComponentInstance);
      this.tabStatList.push({
        tabIndex: this.tabCount++,
        top:0,
        tab:tabComponentInstance
      })
     
    },
    listenTabsScroll() {
      let index;
      let top;
      let height;
      merge(...this.tabList.map((tab) => tab.scrollEvent)).subscribe(
          ({ event, tab }) => {
            index = tab.tabIndex;
            if(!event.detail)return;
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
