/**
* created date 2021/8/17
* user lanjuan
**/
<template>
 <view >
   <view id="selectView" @tap="select">
     <slot></slot>
   </view>
 </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Emit, Prop} from "vue-property-decorator";
import {getSelectRect} from "../utils";
import {Align, Rect} from "../utils/relativeFixed";
import {Subscription} from "rxjs";

@Component({})
export default class extends Vue {

  @Prop({default:150})baseAlignWidth:number;
  @Prop({default:"right"})align:Align;
  @Prop({default:true})autoAlign:boolean;
  @Emit("popup")onPopup(e:{rect:Rect,align:Align}){}

  selectOrder:Subscription|null;
  select({detail}:any){
    if(this.selectOrder){
      this.selectOrder.unsubscribe();
      this.selectOrder=null;
    }
    this.selectOrder=getSelectRect({
      component:this,
      detail,
      autoAlign:this.autoAlign,
      baseAlignWidth:this.baseAlignWidth,
      baseAlign:this.align,
      queryCondition:"#selectView",
      cb:e=>{
        this.selectOrder=null;
        this.onPopup(e)
      }
    });
  }
  
}
</script>

<style scoped lang="scss">
</style>