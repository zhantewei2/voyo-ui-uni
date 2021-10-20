
/** * created date 2021/9/24 * user lanjuan **/
<template>
  <div
      class="yo-lazy-item"
      ref="item"
      :style="[wrapperHeight ? { height: wrapperHeight + 'px'} : {}]"
  >
    <div v-show="visible" v-if="exist" class="voyo-an-fadeIn0">
      <slot></slot>
    </div>
  </div>
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
    if (!window.IntersectionObserver) return;

    const intersection=new IntersectionObserver((entries) => {
      const entry=entries[0];
      subject.next(entry.isIntersecting);
    })
    intersection.observe(this.$refs.item);
    
    subject.subscribe((visible) => {
      visible ? this.show() : this.hide();
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