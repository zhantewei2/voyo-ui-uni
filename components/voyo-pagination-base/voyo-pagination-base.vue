<template>
  <view id="paginationContent">
    <voyo-load-error v-if="initError" slot="initError" @tap="initTap">
      {{ errorHint }}
    </voyo-load-error>
    <voyo-empty @tap="initTap" v-if="isEmpty">{{ emptyHint }}</voyo-empty>
    <view v-if="showScrollWrapper">
      <view class="voyo-pagination-bottom-area">
        <view v-if="downLoading">
          <slot name="downLoading"></slot>
        </view>
        <view v-if="downNoMore">
          <slot name="downNoMore"></slot>
        </view>
        <view v-if="downError" @tap="downErrorTap">
          <slot name="downError"></slot>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    errorHint: {
      type: String,
    },
    emptyHint: {
      type: String,
    },
  },
  computed: {
    showScrollWrapper() {
      return !this.initError && !this.initLoading;
    },
  },
  data() {
    return {
      downLoading: false,
      initLoading: false,
      refreshLoading: false,
      downNoMore: false,
      downError: false,
      initError: false,
      initEnd: false,
      isEmpty: false,
    };
  },
  methods: {
    reset() {
      //isEmpty
      //initError
      this.initEnd = this.downNoMore = this.downError = false;
    },
    setEmpty() {
      this.isEmpty = true;
      this.initError = false;
      this.initLoading = false;
    },
    refreshLoad() {
      this.refreshLoading = true;
    },
    refreshError(err) {
      if (!this.refreshLoading) return;
    },
    refreshSuccess() {
      if (!this.refreshLoading) return;
    },
    initLoad() {
      this.reset();
      this.initLoading = true;
    },
    initSuccess() {
      this.initLoading = false;
      this.initEnd = true;
      this.isEmpty = false;
      this.initError = false;
    },
    initFailure() {
      this.initLoading = false;
      this.initError = true;
      this.isEmpty = false;
    },
    downLoad() {
      this.downLoading = true;
    },
    downLoadNextEnd() {
      this.downLoading = false;
    },
    downLoadComplete() {
      this.downLoading = false;
      this.downNoMore = true;
    },
    downLoadFailure() {
      this.downLoading = false;
      this.downError = true;
    },
    getPaginationContentHeight() {
      return new Promise((resolve, reject) => {
        this.createSelectorQuery()
          .in(this)
          .select("#paginationContent")
          .boundingClientRect()
          .exec(([rect]) => {
            resolve(rect.height);
          });
      });
    },
    initTap() {
      this.$emit("initTap", true);
    },
    downErrorTap() {
      this.$emit("downErrorTap", true);
    },
  },
};
</script>
