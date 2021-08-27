/**
* created date 2021/8/18
* user lanjuan
**/
<template>
 <view @tap="tapLine" class="voyo-cell flex-v-between" :class="[
     border?'__border':''
 ]">
    <view class="_left flex-v-mid">
      <image :src="img" v-if="img" class="voyo-cell-img"></image>
      <text :class="[iconClass,'voyo-cell-icon']" v-if="iconClass"></text>
      <slot name="title"></slot>
      <view v-if="label">
        <view v-if="title" class="voyo-cell-left-title">{{title}}</view>
        <view v-if="label" class="voyo-cell-left-label">{{label}}</view>
      </view>
      <view v-else class="voyo-cell-left-title">
        {{title}}
      </view>
    </view>
    <view class="_right flex-1">
      <view 
        :class="[
          '_right-value',
            valueWidth?'ellipsis':''
        ]"
        :style="[
          valueWidth?{width:valueWidth}:{}
        ]"
      >
        {{value}}
        <slot></slot>
      </view>
      <text v-if="rightIcon" :class="['_right-icon',rightIcon]"></text>
    </view>
   <voyo-ripple ></voyo-ripple>
 </view>
 
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop,Emit} from "vue-property-decorator";
import {setting} from "../setting.service";
import {getSelectRect,Rect,Align} from "../utils";
import {Subscription} from "rxjs";
export type CellType="select"|"link"|"input";

const variousTap=(bind:VoyoCell,detail:{x:number,y:number})=>{
  if(bind.type==="select"){
    if(bind.selectOrder)bind.selectOrder.unsubscribe();
    
    bind.selectOrder=getSelectRect({
      component:bind,
      detail,
      queryCondition:".voyo-cell",
      cb:e=>{
        bind.selectOrder=null;
        bind.selectPopup(e);
      }
    })
  }else if(bind.type==="link"){
    bind.to&&uni.navigateTo({url:bind.to});
  }
}

@Component({
  computed:{
    rightIcon(this:any){
      switch (this.type){
        case "select":
          return setting.cell.selectIcon;
        case "link":
          return setting.cell.linkIcon;
      }
      return "";
    }
  }
})
export default class VoyoCell extends Vue {
  @Prop({})type:CellType;
  @Prop({})to:string;
  @Prop({})title:string;
  @Prop({})label:string;
  @Prop({})value:string;
  @Prop({default:true})ripple:boolean;
  @Prop({default:setting.cell.border})border:boolean;
  @Prop({default:""})valueWidth:string;  //100px or 50vw
  @Prop({})img:string;
  @Prop({})iconClass:string;
  @Emit("selectPopup")selectPopup(e:{rect:Rect,align:Align}){};
  selectOrder:Subscription | null;
  tapLine({detail}:{detail:{x:number,y:number}}){variousTap(this,detail)}
}
</script>