/** * created date 2021/9/26 * user lanjuan **/
<template>
  <view
    class="voyo-input-wrapper flex-v-mid __type-candy"
    :class="[size ? '__size-' + size : '', clearable ? '__clearable' : '']"
  >
    <view class="_container flex-1" >
      <label v-if="$slots.prefix" class="_prefix px-2">
        <slot name="prefix"></slot>
      </label>
      <view class="_input-container" @tap="toInputFocus">
        <view class="voyo-search-input-tags" v-if="showSearchLabel">
          <label class="voyo-search-badge" @tap="clear">
            {{ searchValue }}
            <text class="za za-close ml-1 voyo-text-size-mini"></text>
          </label>
        </view>
        <input
            ref="input"
          :value="value0"
          @blur="inputBlur"
          @input="valueChange"
          @confirm="keyboardConfirm"
          :focus="focus"
          class="_input"
          type="text"
          :style="{
            opacity: showSearchLabel? 0:1
          }"
        />
      </view>
      <label @click="clear" class="_clear voyo-an-fadeIn">
        <text class="za za-close"></text>
      </label>
      <label class="_suffix">
        <slot name="suffix"></slot>
      </label>
    </view>

    <voyo-button
      v-if="focus || inSearch"
      class="ml-1"
      :size="size"
      type="pure"
      @tap="btnConfirm"
    >
      {{ searchLabel }}
    </voyo-button>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
@Component({
  computed: {
    clearable(this:any) {
      return this.value0 && this.focus;
    },
    showSearchLabel(this:any) {
      return this.searchValue && !this.focus;
    },
  },
})
export default class extends Vue {
  @Prop({ default: true }) inSearch: boolean;
  @Prop({ default: "small" }) size: string;
  @Prop({ default: "搜索" }) searchLabel: string;
  @Prop({}) value: string;
  @Prop({default:""})placeholder:string;
  @Prop({default:false})autoFocus:boolean;
  @Watch("autoFocus",{immediate:true})
  watchAutoFocus(v:boolean){
    this.focus=v;
  }
  @Emit("input") emitInput(v: string) {
    this.value0 = v;
  }
  @Emit("focus") inputFocus() {
    this.focus = true;
  }
  @Emit("blur") inputBlur() {
    setTimeout(() => (this.focus = false), 10);
  }
  @Emit("confirm") inputConfirm(v: string) {}
  @Watch("value",{immediate:true})
  watchValue(v: string) {
    this.value0 = v;
  }
  toInputFocus(){
    if(!this.focus)this.inputFocus();
  }
  focus: boolean = false;
  searchValue: string = "";
  value0: string = "";
  clear() {
    this.value0="";
    this.emitInput((this.searchValue = ""));
  }
  valueChange(e:any) {
    this.emitInput(e.detail.value);
  }
  confirm(v: string) {
    if (v) this.value0 = v;
    this.btnConfirm();
  }
  btnConfirm(){
    this.inputBlur();
    this.searchValue = this.value0;
    this.inputConfirm(this.value0);
  }
  keyboardConfirm(e: any) {
    this.confirm(e.detail.value);
  }
  inputSelfFocus(){
    
  }
}
</script>

<style scoped lang="scss"></style>
