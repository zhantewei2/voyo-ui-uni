/**
* created date 2021/8/19
* user lanjuan
**/
<template>
 <view class="flex-v-mid"
      @touchstart="touchstart"
      @touchend="touchend"
      @tap="tap"
 >
   <view class="voyo-checkbox" :class="[
       value0?'__active':'',
   ]">
     <view class="voyo-checkbox-frame abs-full" :class="[
       value0?'voyo-bg-'+color:'',
       value0?'voyo-color-'+color:''
     ]">
        <view class="voyo-checkbox-selected abs-full" v-if="value0"></view>
     </view>
     <voyo-ripple-radio :color="color" ref="ripple" :disable-trigger="true" :disabled="disabled"/>
   </view>
   <slot></slot>

 </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, Watch,Emit} from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop({})disabled:boolean;
  @Prop({default:false})value:boolean;
  @Prop({default:'primary'})color:string;
  @Watch("value",{immediate:true})watchValue(v:boolean){
    if(v!==this.value0)v?this.show():this.close();
  }
  @Emit("input")input(v:boolean){}

  value0:boolean=false;
  toggle(){
    this.value0?this.close():this.show();
  }
  show(){
    this.input(this.value0=true);
  }
  close(){
    this.input(this.value0=false);
  }
  touchstart(e:any,control?:boolean){
    (this.$refs as any).ripple.touchstart(e,true);
  }
  touchend(e:any,control?:boolean){
    (this.$refs as any).ripple.touchend(e,true);
  }
  tap(e:any,control?:boolean){
    (this.$refs as any).ripple.tap(e,true);
    this.toggle();
  }
}
</script>

<style lang="scss">
.voyo-checkbox-selected{
  background-image: svg-load("./select.svg",fill=white);

}
</style>
