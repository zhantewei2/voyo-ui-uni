/**
* created date 2021/8/18
* user lanjuan
**/
<template>
  <view class="voyo-page">

    <scroll-view :scroll-y="true" class="abs-full">

      <view style="height:200px"></view>
      <voyo-select
          style="width:250px;margin-left:100px;background:red"
          @popup="selectPopup">
        id select
      </voyo-select>
      <view style="height:1000px"></view>
    </scroll-view>
    <voyo-select-teleport
        v-model="value"
        ref="selectTeleport" 
        :list="options"
    />
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  title="index title";
  value="1";
  options=[
    {label:"大大方大方大方",value:"1"},
    {label:"大阿福地方",value:"2"},
    {label:"大丰富的",value:"3"}
  ]
  selectPopup(e:any){
    (this.$refs as any).selectTeleport.select(e);
  }
}
</script>

<style scoped lang="scss">

</style>