/**
* created date 2021/8/18
* user lanjuan
**/
<template>
 <view class="voyo-panel" :class="['__type-'+appear]">
   <view class="voyo-panel-header">
     {{title}}
     <slot name="header"></slot>
   </view>
   <view class="voyo-panel-body" :class="[paddingX?'__padding-x':'']">
     <slot></slot>
   </view>
 </view>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop({})title:string;
  @Prop({default:"setting"})appear:"setting"|"list";
  @Prop({default:false})paddingX:boolean;
}
</script>

<style scoped lang="scss">

</style>