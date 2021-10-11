/** * created date 2021/9/24 * user lanjuan **/
<template>
  <view
    class="yo-lazy-item"
    :style="[wrapperHeight ? { height: wrapperHeight + 'px'} : {}]"
  >
    <view v-show="visible" v-if="exist" class="voyo-an-fadeIn0">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import { querySelector } from "../utils";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
@Component({})
export default class extends Vue {
  observer: any;
  visible: boolean = true;
  yoName = ".yo-lazy-item";
  wrapperHeight: string = "";
  exist: boolean=true;
  @Prop({default:false})useExist:boolean;
  beforeDestroy() {
    this.observer && this.observer.disconnect();
  }
  mounted(this: any) {
    const subject = new Subject<boolean>();
    if (!this.createIntersectionObserver) return;
    this.observer = this.createIntersectionObserver();
    this.observer.relativeToViewport();
    subject.subscribe((visible) => {
      visible ? this.show() : this.hide();
    });
    this.observer.observe(this.yoName, (e) => {
      subject.next(e.intersectionRatio > 0);
    });
  }
  queryHeight(this:any){
    if(!this.wrapperHeight){
      setTimeout(()=>{
        querySelector(
            () => this.createSelectorQuery().select(this.yoName).boundingClientRect(),
            ([rect]:any) => rect.height,
        ).then(([rect]: any) => {
          this.wrapperHeight = rect.height ;
        })  
      });
    }
  }
  show() {
    if(this.useExist&&!this.exist)this.exist=true; 
    if(!this.useExist&&!this.visible)this.visible=true;
    this.queryHeight();
  }
  hide(this: any) {
    if(!this.wrapperHeight)return;
    if(this.useExist&&this.exist)this.exist=false;
    if (!this.useExist&&this.visible) this.visible=false;
  }
}
</script>

<style scoped lang="scss"></style>
