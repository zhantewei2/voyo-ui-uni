/**
* created date 2021/8/19
* user lanjuan
**/
<template>
 <view
     @tap="tap"
     @touchstart="touchstart"
     @touchend="touchend"
     @touchcancel="touchend"
     class=""
     :class="[
         active?'__active':'',
         active&&!activeLeaving?'__enter':'',
         activeLeaving?'__leave':'',
         'voyo-ripple-radio',
          '__color-'+color
     ]"
    >
    <view class="voyo-ripple-radio-bg"></view>
    <view class="voyo-ripple-radio-bubbling" v-for="i in list" :key="i.index"></view>
    <slot></slot>
 </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Emit, Prop} from "vue-property-decorator";
const bubblingLeaveDelay=1000;
const activeLeaveDelay1=300;
const activeLeaveDelay2=150;

@Component({})
export default class extends Vue {
  @Prop({default:"primary"})color:string;
  @Prop({default:false})disableTrigger:boolean;
  @Prop({})disabled:boolean;
  @Emit("rippleTap")rippleTap(e:any){}
  active:boolean=false;
  activeLeaving:boolean=false;
  list:any[]=[];
  count:number;
  timeout:any;
  activeTimeout:any;
  activeTimeout2:any;
  hasStarted:boolean;
  beforeCreate(){
    this.count=0;
  }
  touchstart(e:any,control?:boolean){
    if(this.disableTrigger&&!control)return;
    if(this.disabled)return;
    this.hasStarted=true;
    this.activeStart();
  }
  tap(e:any,control?:boolean){
    if(this.disableTrigger&&!control)return ;
    this.rippleStart();
    this.touchend(e,control);
    !this.disabled&&this.rippleTap(e);
  }
  touchend(e:any,control?:boolean){
    if(this.disableTrigger&&!control)return ;
    if(!this.hasStarted)return;
    this.hasStarted=false;
    this.activeClose();
  }
  rippleStart(){
    if(this.timeout){
      clearTimeout(this.timeout);
    }
    const i:any={
      index:this.count++,
      timeout:setTimeout(()=>{
        i.timeout=null;
        const itemIndex:number=this.list.indexOf(i);
        if(itemIndex>=0)this.list.splice(itemIndex,1);
      },bubblingLeaveDelay)
    };
    this.list.push(i);
  }
  
  activeStart(){
    this.activeLeaving=false;
    if(this.activeTimeout)clearTimeout(this.activeTimeout);
    if(this.activeTimeout2)clearTimeout(this.activeTimeout2);
    this.active=true;
  }
  activeClose(){
    if(this.activeTimeout2)clearTimeout(this.activeTimeout2);
    this.activeTimeout=setTimeout(()=>{
      this.activeLeaving=true;
      this.activeTimeout=null;
      this.activeTimeout2=setTimeout(()=>{
        this.activeLeaving=false;
        this.active=false;
        this.activeTimeout2=null;
      },activeLeaveDelay2)
    },activeLeaveDelay1);
  }
  
 
}
</script>

<style scoped lang="scss">

</style>