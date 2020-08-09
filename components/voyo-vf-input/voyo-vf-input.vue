<template>
  <view>
    <view class="voyo-verification">
      <view
        @tap="itemTap"
        v-for="(i, index) in list"
        class="voyo-verification-col"
        :key="index"
      >
        <view
          :class="[value.length - 1 === index ? '__active' : '']"
          class="voyo-verification-col-input"
        >
          {{ i.value }}
        </view>
      </view>
    </view>
    <voyo-keyboard
      :closeBar="false"
      @keyPress="onKeyPress"
      :show="keyboardShow"
    ></voyo-keyboard>
  </view>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      value: 3,
    },
  },
  data() {
    return {
      value: "",
      list: [],
      keyboardShow: false,
    };
  },
  watch: {
    count: {
      immediate: true,
      handler(v) {
        const list = [];
        for (let i = 0; i < v; i++) {
          list.push({
            value: "",
            active: false,
          });
        }
        this.list = list;
      },
    },
  },
  methods: {
    itemTap() {
      this.keyboardShow = true;
    },

    init() {
      this.value = "";
    },
    onKeyPress(e) {
      const length = this.value.length;
      if (e === "del") {
        if (length === 0) return;
        this.value = this.value.slice(0, -1);
        this.list[length - 1].value = "";
      } else {
        if (length < this.count) {
          this.value += e;
          this.list[length].value = e;
        } else {
          //completed
        }
      }
    },
    begin() {
      this.keyboardShow = true;
    },
    close() {
      this.keyboardShow = false;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
