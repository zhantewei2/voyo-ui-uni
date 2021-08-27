/**
* created date 2021/8/18
* user lanjuan
**/
<template>
  <view>
    <voyo-cell title="标题"  value-width="80px" value="内容1 内容1" type="link" />
    <voyo-cell title="标题"  value-width="80px" value="内容1 内容1" type="link" />
    <voyo-cell :img="avatar" title="标题"  value-width="80px" value="内容1 内容1" type="link" />
    <voyo-cell title="标题" icon-class="ui-uni ui-uni-user" />
    <voyo-cell title="标题1" value="内容2" type="link" label="内容介绍one">
      内容2+
    </voyo-cell>
    <voyo-cell @selectPopup="selectPopup" title="title3" value="content" type="select"></voyo-cell>
    <view class="test">
      test
    </view>
    <voyo-select-teleport :list="list" ref="teleport"/>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
//@ts-ignore
import avatar from "./avatar.jpg";
@Component({})
export default class extends Vue {
  avatar=avatar;
  list=[
    {label:"label1",value:"1"},
    {label:"label2",value:"2"}
  ]
  selectPopup(e:any){
    (this.$refs as any).teleport.select(e);
  }
}
</script>

<style scoped lang="scss">
.test{
  height:100px;
  width: 100px;
  background-image:svg-load("./active.svg",fill=var(--color-primary));
  background-size:100%;
}
</style>