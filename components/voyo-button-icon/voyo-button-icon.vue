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
    :disabled="disabled"
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
export default {
  data() {
    return {
      name: "name",
      ripple: "rill23pe",
      rippleCbValue: false,
    };
  },

  props: {
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
  },
};
</script>
<style lang="scss"></style>
