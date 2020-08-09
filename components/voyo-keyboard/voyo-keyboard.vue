<template>
  <view
    @tap.stop="keyboardTap"
    class="voyo-keyboard"
    v-if="displayContent"
    :class="[
      showContent ? 'voyo-keyboard-an-in' : 'voyo-keyboard-an-out',
      closeBar ? '__closebar' : '',
    ]"
  >
    <view class="voyo-keyboard-closebar" @tap="closeBarTap" v-if="closeBar">
      <i class="za za-down"></i>
    </view>
    <view
      class="voyo-keyboard-content"
      :class="[useEnter ? '__double' : '__alone']"
    >
      <view class="_keys-wrapper">
        <view
          class="_keys-wrapper-row"
          :key="index"
          v-for="(row, index) in keys"
        >
          <template v-for="i in row">
            <span
              :key="i.value"
              v-if="i.value === '.' && !useDot"
              class="voyo-keyboard-item-holder"
            ></span>
            <button
              :key="i.value"
              v-else
              class="voyo-keyboard-item"
              @tap="keyTap(i)"
            >
              <text :class="i.icon ? 'za za-' + i.icon : ''">
                {{ i.icon ? "" : i.value }}
              </text>
            </button>
          </template>
        </view>
      </view>
      <view class="_enter-wrapper">
        <button @tap="confirmTap" class="voyo-keyboard-enter-btn">
          <text>确定</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
interface KeyItem {
  value: string | number;
  icon?: string;
}

export default {
  props: {
    useDot: {
      type: Boolean,
      default: false,
    },
    useEnter: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    closeBar: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(v: boolean) {
        v ? this.contentShow() : this.contentHide();
      },
    },
    value(v: string) {
      this.value0 = v;
    },
  },
  data() {
    return {
      keys: [
        [{ value: "1" }, { value: "2" }, { value: "3" }],
        [{ value: "4" }, { value: "5" }, { value: "6" }],
        [{ value: "7" }, { value: "8" }, { value: "9" }],
        [{ value: "." }, { value: "0" }, { value: "del", icon: "del-outline" }],
      ],
      showContent: false,
      displayContent: false,
    };
  },
  beforeCreate() {
    this.contentHideTimeout = null;
    this.value0 = "";
  },
  methods: {
    contentShow() {
      if (this.showContent) return;
      if (this.contentHideTimeout) {
        clearTimeout(this.contentHideTimeout);
        this.contentHideTimeout = null;
      }
      this.showContent = true;
      this.displayContent = true;
      this.$emit("showChange", true);
    },
    contentHide() {
      if (!this.showContent) return;
      this.showContent = false;
      this.contentHideTimeout = setTimeout(() => {
        this.displayContent = false;
      }, 300);
      this.$emit("showChange", false);
    },
    keyTap(i: KeyItem) {
      this.$emit("keyPress", i.value);
      this.handleValue(i.value);
    },
    confirmTap() {
      this.$emit("keyPress", 13);
    },
    handleValue(key: string) {
      let value: string = this.value0 ? this.value0 : "";
      if (key === "del") {
        value = value.slice(0, -1);
      } else {
        value += key;
      }
      this.$emit("valueChange", value);
    },
    keyboardTap(e) {
      e.voyoKeyboardTap = true;
    },
    closeBarTap() {
      this.contentHide();
    },
  },
};
</script>

<style scoped lang="scss">
@import "~@voyo/core-style/lib/components/_keyboard.scss";
</style>
