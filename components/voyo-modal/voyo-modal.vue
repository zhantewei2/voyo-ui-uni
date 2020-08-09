<template>
  <voyo-popup
    :show="isShow"
    :appear="false"
    type="mid"
    @showChange="showChange"
    :defaultClose="defaultClose"
  >
    <view class="voyo-dialog">
      <!--      <view class="voyo-dialog-header"></view>-->
      <view class="voyo-dialog-article">
        <slot></slot>
      </view>
      <view class="voyo-dialog-footer">
        <button
          @tap="tap(false)"
          v-if="useCancel"
          class="voyo-dialog-footer-cancel weixin-pure-btn"
        >
          {{ textCancel }}
          <voyo-ripple></voyo-ripple>
        </button>

        <button
          @tap="tap(true)"
          v-if="useConfirm"
          class="voyo-dialog-footer-confirm weixin-pure-btn"
        >
          {{ textConfirm }}
          <voyo-ripple></voyo-ripple>
        </button>
      </view>
    </view>
  </voyo-popup>
</template>
<script>
export default {
  props: {
    show: {
      default: false,
    },
    useConfirm: {
      type: Boolean,
      default: true,
    },
    useCancel: {
      type: Boolean,
      default: true,
    },
    textConfirm: {
      type: String,
      default: "确定",
    },
    textCancel: {
      type: String,
      default: "取消",
    },
    defaultClose: {
      type: Boolean,
      default: true,
    },
    tapClose: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    show: {
      handler(v) {
        if (v == this.isShow) return;
        this.isShow = v;
      },
      immediate: true,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    showChange(show) {
      if (show === this.isShow) return;
      this.$emit("showChange", (this.isShow = show));
    },
    confirm() {
      !this.tapClose
        ? this.$emit("confirm", {
            close: () => this.showChange(false),
          })
        : this.showChange(false);
    },
    tap(confirm) {
      this.$emit(confirm ? "confirm" : "cancel", {
        close: () => this.showChange(false),
      });
      this.tapClose && this.showChange(false);
    },
  },
};
</script>
<style lang="scss"></style>
