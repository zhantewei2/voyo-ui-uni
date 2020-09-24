import {setting}from "../setting.service";
console.log("ss",setting.refresh.triggerIcon);
export default {
  props: {
    enabled: {
      type:Boolean ,
      default:true,
    },
    refreshItemText:{
      type:String,
      default:setting.refresh.itemText
    },
    refreshItemIcon:{
      type:String,
      default:setting.refresh.itemIcon
    },
    refreshTriggerText:{
      type:String,
      default:setting.refresh.triggerText
    },
    refreshTriggerIcon:{
      type:String,
      default:setting.refresh.triggerIcon
    },
    refreshRunText:{
      type:String,
      default:setting.refresh.runText
    },
    refreshRunIcon:{
      type:String,
      default:setting.refresh.runIcon
    },
    refreshSuccessText:{
      type:String,
      default:setting.refresh.successText
    },
    refreshSuccessIcon:{
      type:String,
      default:setting.refresh.successIcon
    }
  },
  computed:{
    canRefresh(){
      return this.enabled&&!this.refreshing;
    }
  },
  data() {
    return {
      refreshing: false,
      init:false,
      refreshCompleteValue:0
    }
  },
  mounted(){
    this.init=true;
  },
  methods:{
    show(...args){
      console.log(...args);
    },
    move(e){
      const touch=e.touches[0];
      console.log("move",touch.pageY);
    },
    refreshStart(){
      this.refreshing=true;
      this.$emit("refreshStart","");
    },
    refreshComplete(){
      this.refreshing=false;
      this.refreshCompleteValue++;
    }
  },
};
