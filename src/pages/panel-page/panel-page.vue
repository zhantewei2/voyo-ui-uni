/**
* created date 2021/8/19
* user lanjuan
**/
<template>
 <view class="voyo-page">
   <voyo-panel title="title" appear="list">
     <voyo-cell title="title" value="value"></voyo-cell>
     <voyo-cell title="title" value="value"></voyo-cell>
     <voyo-cell title="title" value="value"></voyo-cell>
   </voyo-panel>
   <voyo-panel title="title" appear="setting">
     <voyo-cell title="title" value="value"></voyo-cell>
     <voyo-cell title="title" value="value"></voyo-cell>
     <voyo-cell title="title" value="value"></voyo-cell>
   </voyo-panel>
   <view class="mx-3">
     <voyo-button >delete11</voyo-button>
     <voyo-button >btn</voyo-button>
   </view>
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