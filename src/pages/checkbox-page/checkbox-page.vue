/**
* created date 2021/8/19
* user lanjuan
**/
<template>
  <view>
 <view class="voyo-li">
  <voyo-checkbox v-model="val" color="error">Label</voyo-checkbox>
 </view>
  <view class="voyo-li">
    <voyo-checkbox  v-model="val">Label</voyo-checkbox>
  </view>
  <view class="voyo-li">
    <voyo-checkbox  v-model="val">Label</voyo-checkbox>
  </view>
  <view class="voyo-li">
    <voyo-checkbox  v-model="val">Label</voyo-checkbox>
  </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  val:boolean=true;
  touchend(){

  }
}
</script>

<style scoped lang="scss">
.text{
  
}
</style>