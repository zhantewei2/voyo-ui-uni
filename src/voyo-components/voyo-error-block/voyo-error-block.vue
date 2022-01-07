/** * created date 2022/1/7 * user lanjuan **/
<template>
  <view
    class="voyo-figure voyo-an-fadeIn0"
    :class="{
      'abs-center-page': absCenterPage || absCenterPage === '',
    }"
    @tap="viewTap"
  >
    <image
      :style="{
        width: width,
        height: height,
      }"
      :src="img"
      class="_image"
      mode="aspectFill"
    ></image>
    <div class="_title">
      {{ isNetworkBreak ? netWorkErrMsg : serverErrMsg }}
    </div>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
import { setting } from "../setting.service";
import { VoyoError} from "@ztwx/utils";

@Component({})
export default class extends Vue {
  @Prop({ default: "10em" }) width: string;
  @Prop({ default: "10em" }) height: string;
  @Prop({ default: "" }) serverErr: string;
  @Prop({ default: "" }) networkErr: string;
  @Prop({}) except: YoError<string>;
  @Prop({}) absCenterPage: boolean;
  @Watch("serverErr", { immediate: true }) watchServerErr(e: string) {
    if(e)this.serverErrMsg = e;
  }
  @Watch("networkErr", { immediate: true }) watchNetworkErr(e: string) {
    if(e)this.netWorkErrMsg = e;
  }
  @Watch("except", { immediate: true }) watchExcept(e: VoyoError) {
    if (!e) return;
    
    this.isNetworkBreak = e.code === "100";
    if (e.code !== "100") {
      this.serverErrMsg = this.serverErr || e.message;
    }
  }
  @Emit("viewTap") viewTap() {}

  img: string = "";
  serverErrMsg: string = "";
  netWorkErrMsg: string = "";
  isNetworkBreak: boolean = false;
  beforeCreate(){
    this.img = setting.errorImg;
    this.netWorkErrMsg= setting.err.network;
  }
}
</script>

<style scoped lang="scss"></style>
