<template>
  <view>
    <view class="voyo-verification"
          :class="{
        '__disable':disable
      }"
    >
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
        :closeBar="true"
        @keyPress="onKeyPress"
        @showChange="keyboardShowChang"
        :show="keyboardShow"
        :use-enter="useEnter"
    ></voyo-keyboard>
  </view>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 4,
    },
    useEnter:{
      type: Boolean,
      default: false
    },
    disable:{
      type: Boolean,
      default: false
    },
    autoOpenKeyboard:{
      type: Boolean,
      default :false
    }
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
            value: ""
          });
        }
        this.list = list;
      },
    },
  },
  created(){
    this.keyboardShow=this.autoOpenKeyboard;
  },
  methods: {
    itemTap() {
      if(this.disable)return;
      this.keyboardShow = true;
    },

    init() {
      this.value = "";
    },
    keyboardShowChang(e){
      this.keyboardShow=e;
    },
    onKeyPress(e) {
      const length = this.value.length;
      if(e===13){
        this.$emit("confirm",this.value);
      }else if (e === "del") {
        if (length === 0) return;
        this.value = this.value.slice(0, -1);
        this.list[length - 1].value = "";
      } else {
        if (length < this.count) {
          this.value += e;
          this.list[length].value = e;
          //completed
          if(this.value.length>=this.count)  this.$emit("complete",this.value);
        }
      }
    },
    clear(){
      this.value="";
      this.list=[];
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