<template>
<view>
  <voyo-line
    v-for="(i,index) in  list"
    :key="index"
    @tap="tapLine(i)"
  >
    <view slot="left">
      {{i.label}}
    </view>
  </voyo-line>
  <view class="div">
    22
  </view>
</view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component,Prop } from "vue-property-decorator";

@Component({})
export default class extends Vue {
  list=[
    {path:"/pages/select-page/select-page",label:"select"},
    {path:"/pages/panel-page/panel-page",label:"panel"},
    {path:"/pages/cell-page/cell-page",label:"cell"},
    {path:"/pages/checkbox-page/checkbox-page",label:"checkbox"},
  ]
  tapLine(i:any){
    uni.navigateTo({
      url:i.path
    })
  }
}
</script>

<style lang="scss">
@use "b";
</style>
