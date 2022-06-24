/**
* created date 2022/6/22
* user lanjuan
**/
<template>
 <view class="voyo-page">
   <scroll-view :scroll-y="true" class="abs-full">
    <view class="voyo-li voyo-border-bottom flex flex-around">
      <voyo-button color="primary" size="mini">1</voyo-button>
      <voyo-button color="secondary" size="small">2</voyo-button>
      <voyo-button color="warn" size="medium">3</voyo-button>
    </view>
   <view class="voyo-li voyo-border-bottom flex flex-around">
     <voyo-button color="primary" size="small" type="appear">1</voyo-button>
     <voyo-button color="primary" size="small" type="pure">2</voyo-button>
     <voyo-button color="primary" size="small" type="candy">2</voyo-button>
     <voyo-button color="primary" size="small" type="outline">3</voyo-button>
   </view>
   <view>
     <voyo-button block> block</voyo-button>
     <view class="voyo-li">
     <voyo-button block round> round</voyo-button>
     </view>
   </view>
     <view class="voyo-li voyo-border-bottom">
      <voyo-button-icon>
        <text class="ui-uni ui-uni-user"></text>
      </voyo-button-icon>
    </view>
    <view class="voyo-card">
      card
    </view>


   </scroll-view>
 </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class extends Vue {

}
</script>

<style scoped lang="scss">

</style>
