<!--
  @author ztw
  @createdDate 2020/8/21 15:41
-->
<template>
  <view class="voyo-snackbar-bg" v-if="show">
    <view
        class="voyo-snackbar-wrapper"
        :class="[showAn ? 'voyo-an-slideDownIn' : 'voyo-an-slideDownOut']"
    >
      <view class="_left">
        <slot name="left"></slot>
      </view>
      <view class="_content">
        <slot name="content"></slot>
      </view>
      <view v-if="useClose" @tap="close" class="_close flex-center">
        <voyo-button-icon type="pure" color="secondary" size="mini">
          <text :class="[closeClass]"></text>
        </voyo-button-icon>
      </view>
    </view>
  </view>
</template>

<script>
import { setting } from "@voyo/ui-uni/components/setting.service";

export default {
  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
    useClose: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    autoCloseTime: {
      type: Number,
      default: 3000,
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (v === this.showAn) return;
        v ? this.open() : this.close();
      },
    },
  },
  data() {
    return {
      closeClass: setting.popupCloseIconClassName,
      show: false,
      showAn: false,
    };
  },
  beforeCreate() {
    this.outTimeout = null;
  },
  methods: {

    clearAnTimeout(){
      if(this.anTimeout){
        clearTimeout(this.anTimeout);
        this.anTimeout=null;
      }
      this.anCloseRunning=false;
    },
    clearTimeout(){
      if(this.outTimeout){
        clearTimeout(this.outTimeout);
        this.outTimeout=null;
      }
    },
    open() {
      this.clearTimeout();
      this.clearAnTimeout();

      this.show = this.showAn = true;
      if (this.autoClose) {
        this.outTimeout=setTimeout(() => {
          this.outTimeout=null;
          this.close();
        }, this.autoCloseTime);
      }
    },
    close() {
      this.clearTimeout();
      this.showAn = false;
      if(this.anCloseRunning)return;
      this.$emit("input", false);

      this.anCloseRunning=true;
      this.anTimeout = setTimeout(() => {
        this.anCloseRunning=false;
        this.anTimeout=null;
        this.show = false;
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped></style>