<template>
  <button
    id="btn"
    ref="button"
    :class="[
      'btn',
      'voyo-btn',
      'voyo-btn-' + type,
      'voyo-btn-size-' + size,
      shadow? 'voyo-btn-shadow-' +color: '',
      '__' + color,
      rippleCbValue ? 'ripple-callback' : '',
      loading ? '__loading' : '',
      block || block === '' ? 'voyo-btn-block' : '',
      strip || strip === '' ? 'voyo-btn-strip' : '',
      round || round === '' ? 'voyo-btn-round' : '',
    ]"
    :style="{
      width: width ? width + 'px' : '',
    }"
    :hover-class="hoverClass"
    :disabled="disabled||loading"
    :open-type="openType"
    @tap="btnTap"
    @getuserinfo="getuserinfo"
    @opensetting="opensetting"
  >
    <label class="voyo-btn-loading-wrapper">
      <label
        v-if="loading"
        class="voyo-btn-loading za za-loading voyo-an-loading"
      ></label>
    </label>

    <slot></slot>

    <voyo-ripple
      v-if="!disabled&&ripple"
      @callback="rippleCb"
      css="ripple-btn"
    ></voyo-ripple>
  </button>
</template>
<script lang="js">
// export type ColorVarious="primary"|"primary2"|"secondary"|"error"|"warn"|"success";
// export type SizeVarious="mini"|"small"|"now"|"medium"|"strong"|"large";
// export type BtnTypeVarious="appear"|"outline"|"pure"|"candy";
import {isH5} from "../utils";
import {setting} from "../setting.service";

export default {
  data(){
    return {
      "name":"name",
      rippleCbValue:false
    }
  },

  props:{
    "shadow":{
      type: String,
      default: false,
    },
    "size":{
      type:String,
      default :"now"
        },
    "color":{
      type:String,
      default:"primary"
    },
    "type":{
      type:String,
      default:"appear"
    },
    "disabled":{
      type:Boolean,
      default:false
    },
    "loading":{
      type:Boolean,
      default:false
    },
    "block":{
      type:Boolean,
      default:false
    },
    "openType":{
      type:String,
      default:''
    },
    "strip":{
      type:Boolean,
      default:false
    },
    "round":{
      type:Boolean,
      default:false
    },
    "width":{
      type:Number
    },
    "hoverClass":{
      type:String,
      default:"btn-hover"
    },
    "ripple":{
      type:Boolean,
      default:true
    },
    "behavior":{
      type:String || Object,
    }
  },
  methods:{
    rippleCb(active){
      this.rippleCbValue=active;
    },
    getuserinfo(e){
      this.$emit('getuserinfo',e);
    },
    opensetting(e){
      this.$emit("opensetting",e);
    },
    btnTap(e){
      if(setting.btnBehaviorRecord&&this.behavior)setting.btnBehaviorRecordSubject.next(this.behavior)
      if(isH5){
        this.$emit("click",e);
        this.$emit("tap",e);
      }
    }
  }
}
</script>
<style lang="scss"></style>
