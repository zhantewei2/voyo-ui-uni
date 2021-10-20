<template>
  <scroll-view
    id="voyo-tab-page"
    :scroll-y="enableScroll"
    class="voyo-tab-page"
    :class="{
      gentle:gentle
    }"
    @scroll="scroll"
    :scroll-top="scrollPos"
    :enhanced="true"
    :bounces="false"
  >
    <view class="voyo-tab-page-container" data-voyo-type="voyo-tab-page">
      <slot></slot>
    </view>
  </scroll-view>
</template>
<script>
  import { TabGroupName, findChildrenFromList, TabsName } from "../utils/findComponent";
  import { systemInfo ,ExcuteAfterConnected} from "../utils";
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
        componentName: "voyo-tab-page",
        enableScroll: true,
        scrollPos:0,
      };
    },
    props: {
      // distance to the bottom of scroll
      bottomDistance: {
        type: Number,
        default: 0,
      },
      gentle:{
        type:Boolean,
        default:false,
      },
      initTabs:{
        type:Boolean,
        default: true
      }
    },
    beforeCreate() {
      this.execute=new ExcuteAfterConnected();
      this.pageTop = 0;
      this.scrollTop = 0;
      this.pageHeight = 0;
      this.scrollChange = new Subject();
      this.scrollHeightInit=false;
      this.scrollChangeAll = merge(
        this.scrollChange,
        this.scrollChange.pipe(
          debounceTime(100),
          mergeMap((e) => {
            if(!this.scrollNodeRef)this.scrollNodeRef=uni.createSelectorQuery().in(this).select(".voyo-tab-page").scrollOffset();
            return new Observable((ob) => {
              this.scrollNodeRef.exec(([r]) => {
                ob.next({detail:r});
                ob.complete();
              })

            });
          }),
        ),
      );
      this.scrollChangeAll.subscribe((e) => this.listenScroll(e));
    },
    mounted() {
      this.execute.connect();
    },
    methods: {
      getPageHeight(){
        return new Promise((resolve)=>{
          uni
              .createSelectorQuery()
              .in(this)
              .select("#voyo-tab-page")
              .boundingClientRect()
              .exec(([rect]) => {
                this.pageTop = rect.top;
                resolve(this.pageHeight = rect.height);
              });
        })
      },
      scrollTo(x){
        this.scrollPos=x;
      },
      
      registryTabGroup(tabGroup,tabs){
        this.tabGroup=tabGroup;
        this.tabs=tabs;
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

      async listenScroll(e) {
        if(!this.tabs)return;
        
        this.scrollTop = e.detail.scrollTop;
        this.scrollHeight = e.detail.scrollHeight;
        if(!this.pageHeight||(!this.scrollHeightInit&&this.scrollTop)){
          this.pageHeight=await this.getPageHeight();
          if(this.scrollTop)this.scrollHeightInit=true;
        }
        this.scrollMax = Math.floor(
          this.scrollHeight - this.pageHeight - this.bottomDistance,
        )-1;
        if (this.scrollTop >= this.scrollMax && this.tabsScrollIsDisabled) {
          this.tabsScrollIsDisabled = false;
          this.tabs && this.tabs.enableScroll();
          console.log("page scroll", "tabs enable scroll");
        } else if (
          this.scrollTop < this.scrollMax &&
          !this.tabsScrollIsDisabled
        ) {
          this.tabsScrollIsDisabled = true;
          this.tabs && this.tabs.disableScroll();
          console.log("page scroll", "tabs disable scroll");
        }
      },
    },
  };
</script>
<style lang="scss"></style>