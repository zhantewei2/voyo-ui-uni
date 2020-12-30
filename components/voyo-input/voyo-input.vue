<template>
  <view
      class="voyo-input-wrapper"
      :class="[
      appear ? '__type-' + appear : '',
      size ? '__size-' + size : '',
      $slots.prefix ? '__prefix' : '',
      $slots.suffix ? '__suffix' : '',
      canClear ? '__clearable' : '',
      showPlaceholder ? '__show-placeholder' : '',
      isFocus ? '__focus' : '',
      $slots.footer ? '__footer' : '',
      color ? '__color' - color : '',
      noBorder? '__no-border':''
    ]"
  >
    <view class="_header"></view>
    <view class="_container">
      <label class="_prefix">
        <label class="_adapter-container">
          <slot name="prefix"></slot>
        </label>
        <view class="_placeholder"> {{ placeholder }} </view>
      </label>
      <label class="_input-container">
        <view class="_input" v-if="onlyTap" @tap="inputTap">{{value0}} </view>
        <view
            class="_input __visual-input"
            v-if="visual"
            @tap.stop="visualInputTap"
        >
          <view class="_visual-input-text">
            {{ value0 }}
          </view>
          <view
              class="_visual-input-cursor"
              :class="[visualKeyboardShow ? '_show' : '']"
          ></view>
        </view>
        <input
            v-if="!onlyTap && !visual"
            :type="type"
            :value="value0"
            :maxlength="maxlength"
            :focus="focus"
            @blur="inputBlur"
            @focus="inputFocus"
            @confirm="inputConfirm"
            class="_input"
            @input="inputEnter"
            :cursor-spacing="cursorSpacing"
            :disabled="disabled"
        />
      </label>
      <label @click="clear" class="_clear">
        <label class="za za-close"></label>
      </label>
      <label class="_suffix">
        <slot name="suffix"></slot>
      </label>
      <label class="_container-line"></label>
    </view>
    <view class="_footer">
      <slot name="footer"></slot>
    </view>
    <voyo-keyboard
        :value="value0"
        @valueChange="visualKeyboardChange"
        v-if="visual"
        :show="visualKeyboardShow"
        :useEnter="keyboardConfirm"
        @keyPress="keyboardKeyPress"
        @showChange="keyboardShowChange"
        :closeBar="keyboardCloseBar"
    ></voyo-keyboard>
  </view>
</template>
<script>
  export default {
    props: {
      maxlength: {
        type: Number,
        default: 140,
      },
      placeholder: {
        type: String,
      },
      color: {
        type: String,
        default: "primary",
      },
      // export type InputAppear="flat"|"md"|"candy";
      appear: {
        type: String,
        default: "flat",
      },
      size: {
        type: String,
        default: "now",
      },
      value: {
        type: String || Number,
      },
      type: {
        type: String,
        default: "text",
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      clearable: {
        type: Boolean,
        default: true,
      },
      focus: {
        type: Boolean,
        default: false,
      },
      onlyTap: {
        type: Boolean,
        default: false,
      },
      visual: {
        type: Boolean,
        default: false,
      },
      keyboardConfirm: {
        type: Boolean,
        default: false,
      },
      keyboardCloseBar: {
        type: Boolean,
        default: true,
      },
      cursorSpacing: {
        type: Number,
        default: 0,
      },
      noBorder:{
        type: Boolean,
        default :false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(v) {
          this.value0 = v;
        },
      },
    },
    computed: {
      showPlaceholder() {
        return this.value0 !== 0 && !this.value0 && !this.isFocus;
      },
      canClear() {
        return !!this.value0 && this.clearable && this.isFocus;
      },
    },
    data() {
      return {
        isFocus: false,
        value0: "",
        visualKeyboardShow: false,
      };
    },
    methods: {
      inputBlur(e) {
        this.isFocus = false;
        this.$emit("blur", e);
      },
      inputFocus(e) {
        this.isFocus = true;
        this.$emit("focus", e);
      },
      inputConfirm(e) {
        this.$emit("confirm", e);
      },
      inputEnter(e) {
        this.$emit("input", (this.value0 = e.detail.value));
      },
      clear() {
        this.$emit("input", (this.value0 = ""));
      },
      inputTap() {
        this.$emit("inputTap", true);
      },
      visualInputTap() {
        if (!this.visualKeyboardShow) {
          this.visualKeyboardShow = true;
        }
        if (!this.isFocus) this.inputFocus();
      },
      hiddenVisual() {
        this.visualKeyboardShow = false;
        if (this.isFocus) this.inputBlur();
      },
      visualKeyboardChange(v) {
        this.$emit("input", (this.value0 = v));
      },
      keyboardKeyPress(v) {
        if (v === 13) this.inputConfirm();
      },
      keyboardShowChange(v) {
        if (!v) this.hiddenVisual();
      },
    },
    /**
     * uniapp can not use $attrs
     *        can not use $listeners
     */
    mounted() {},
  };
</script>
<style lang="scss">
  :host {
    display: block;
  }
  @import "./input.scss";
</style>
