<template>
  <button
    id="btn"
    ref="button"
    :class="[
      'btn',
      'voyo-btn-icon',
      'voyo-btn-' + type,
      'voyo-btn-icon-size-' + size,
      '__' + color,
      rippleCbValue ? 'ripple-callback' : '',
    ]"
    @tap="btnTap"
    :disabled="disabled"
    :open-type="openType"
  >
    <slot></slot>
    <voyo-ripple @callback="rippleCb" css="ripple-btn"></voyo-ripple>
  </button>
</template>
<script>
// export type ColorVarious="primary"|"primary2"|"secondary"|"error"|"warn"|"success";
// export type SizeVarious="mini"|"small"|"now"|"medium"|"strong"|"large";
// export type BtnTypeVarious="appear"|"outline"|"pure"|"candy";
import Vue from "vue";
import {isH5} from "../utils";
export default {
  data() {
    return {
      name: "name",
      ripple: "rill23pe",
      rippleCbValue: false,
    };
  },

  props: {
    openType:{
      type:String,
    },
    size: {
      type: String,
      default: "now",
    },
    color: {
      type: String,
      default: "primary",
    },
    type: {
      type: String,
      default: "appear",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {},
  methods: {
    rippleCb(active) {
      this.rippleCbValue = active;
    },
    btnTap(e){
      if(isH5){
        this.$emit("click",e);
        this.$emit("tap",e);
      }
    }
  },
};
</script>
<style lang="scss"></style>
