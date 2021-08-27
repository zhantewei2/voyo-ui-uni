/**
* created date 2021/8/18
* user lanjuan
**/
<template>
 <view>
   <view v-if="show" class="voyo-select-bg" :class="[
         state==='entry'?'_entry':
         state==='leave'?'_leave':
         '_handle'
     ]">
     <view @tap="leave" class="_layout-bg">
     </view>
     <view class="voyo-select-container"
           :class="['voyo-an-origin-'+originPosition]"
           :style="{
       top:top,
       left:left
      }"
     >
       <view class="voyo-select-ul" v-if="list&&list.length">
         <view @tap="selectItem(i)" 
               :class="{
                  '__active':i.value === useValue
               }"
               class="voyo-select-li flex-v-between" v-for="i in list" :key="i.value">
           {{i.label}}
           <voyo-ripple></voyo-ripple>
           <view class="_select-li-icon text-right">
            <text v-if="i.value===useValue" :class="[selectClass]"></text>
           </view>
         </view>
       </view>
       <slot></slot>
     </view>
   </view>
 </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Emit, Prop, Watch} from "vue-property-decorator";
import {querySelectorOb,systemInfo,pageHeaderTotalH} from "../utils";
import {Align, Rect, relativeFixed} from "../utils/relativeFixed";
import {setting} from "../setting.service";
export interface Item{
  label:string;
  value:string;
}

@Component({})
export default class extends Vue {
  @Prop({})value:string;
  @Prop({})list:Array<Item>;
  @Prop({default:"right"})align:Align;
  @Emit("input")onInput(e:string){};
  @Watch("value",{immediate:true})watchValue(v:string){
    this.useValue=v;
  }
  useValue:string="";
  selectClass:string=setting.selectIconClassName;
  show:boolean=false;
  top:string="-100vh";
  left:string="-100vw";
  state:'entry'|'leave'|'handle'='handle';
  leaveTimeout:any;
  queryOrder:any;
  leaveTime:any;
  calTimeout:any;
  originPosition:string="";
  align2?:Align=undefined;
  
  getScreenRect(){
    return {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    }
  }
  select({rect,align}:{rect:Rect,align?:Align}){
    this.clearLeave();
    this.clearCal();
    this.show=true;
    if(align)this.align2=align;
    this.calContainerPosition(rect);
  }
  calContainerPosition(targetRect:Rect){
    const useAlign=this.align2||this.align;
    this.calTimeout=setTimeout(()=>{
      this.queryOrder=querySelectorOb(
          ()=>(uni.createSelectorQuery().in(this).select(".voyo-select-container") as any).boundingClientRect(),
          (([rect]:any)=>rect&&rect.width)
      ).subscribe(([rect]:any)=>{
        this.queryOrder=null;
        const screenRect=this.getScreenRect();
        
        const resizeRect=relativeFixed.switchPosition(targetRect,rect,{
          width:screenRect.width,
          height:screenRect.height,
          spaceTop: pageHeaderTotalH
        },useAlign)
        this.originPosition=relativeFixed.switchOrigin(targetRect,resizeRect,useAlign);
        this.entry(resizeRect)
      });
    },50);
  }

  entry(resizeRect:Rect){
    this.top=resizeRect.top+"px";
    this.left=resizeRect.left+"px";
    this.state="entry";
  }
  clearCal(){
    if(this.calTimeout){
      clearTimeout(this.calTimeout);
      this.calTimeout=null;
    }
    if(this.queryOrder){
      this.queryOrder.unsubscribe();
      this.queryOrder=null;
    }
  }
  clearLeave(){
    if(this.leaveTimeout){
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout=null;
    }
  }
  leave(){
    this.state="leave";
    this.leaveTimeout=setTimeout(()=>{
      this.show=false;
      this.leaveTime=null;
    },210);
  }
  selectItem(i:Item){
    this.onInput(this.useValue=i.value);
    this.leave();
  }

}
</script>

<style scoped lang="scss">

</style>