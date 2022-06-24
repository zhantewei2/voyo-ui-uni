
/** * created date 2021/9/24 * user lanjuan **/
<template>
  <div
      class="yo-lazy-item"
      ref="item"
      :style="[wrapperHeight ? { height: wrapperHeight + 'px'} : {}]"
  >
    <div v-show="visible" v-if="exist" class="voyo-an-fadeIn0">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop,Watch} from "vue-property-decorator";
import { querySelector } from "../utils";
import { debounceTime } from "rxjs/operators";
import {ExcuteAfterConnected} from "../utils/excuteAfterConnected";

@Component({})
export default class VoyoLazyItemH5 extends Vue {
  observer: any;
  visible: boolean = true;
  yoName = ".yo-lazy-item";
  wrapperHeight: string = "";
  parentIntersectionKey:string="voyo-lazy-parent-intersection";
  exist: boolean=true;
  $refs:any;
  $parent:any;
  excuteAfterMounted:ExcuteAfterConnected;
  @Prop({default:false})useExist:boolean;
  beforeDestroy() {
    this.observer && this.observer.disconnect();
  }
  beforeCreate(){
    this.excuteAfterMounted=new ExcuteAfterConnected();
  }
  activated(){
    this.registryParentIntersection();
  }
  deactivated(){
    this.unregistryParentIntersection();
  }
  mounted(this: any) {
    if (!window.IntersectionObserver) return;
    this.createParentIntersection(this.$parent);
    this.registryParentIntersection();
    this.excuteAfterMounted.connect();
  }
  registryParentIntersection(){
    // console.debug("registry~intersection")
    this.$parent[this.parentIntersectionKey].registry(this.$refs.item,this,(intersecting:any)=>{
      intersecting?this.show():this.hide();
    });
  }
  unregistryParentIntersection(){
    // console.debug("unregistry~intersection")
    this.$parent[this.parentIntersectionKey].unregistry(this.$refs.item);
  }
  createParentIntersection(parent:any){
    let parentInters:{
      list: Array<{el:HTMLElement,instance:VoyoLazyItemH5,callback:(isIntersecting:boolean)=>void}>,
      registry:(el:HTMLElement,instance:VoyoLazyItemH5,callback:(isIntersecting:boolean)=>void)=>void;
      observer: IntersectionObserver
    }=parent[this.parentIntersectionKey];
    if(!parentInters){

      parentInters=parent[this.parentIntersectionKey]={
        list:[],
        observer:new IntersectionObserver((entries)=>{
          let i:{el:HTMLElement,instance:VoyoLazyItemH5,callback:(isIntersecting:boolean)=>void};
          entries.forEach(entry=>{
            i=parentInters.list.find(item=>item.el===entry.target) as any;
            if(i){
              i.callback(entry.isIntersecting);
            }
          })
        }),
        registry:(el:HTMLElement,instance:VoyoLazyItemH5,callback:(isIntersecting:boolean)=>void)=>{
          if(parentInters.list.find(i=>i.el===el))return;
          parentInters.observer.observe(el);
          parentInters.list.push({
            el,
            instance,
            callback
          })
        },
        unregistry:(el:HTMLElement)=>{
          let observeIndex:number=parentInters.list.findIndex(i=>i.el===el);
          if(observeIndex<0)return;
          parentInters.observer.unobserve(el);
          parentInters.list.splice(observeIndex,1);
        }
      }
    }
  }

  queryHeight(this:any){
    if(!this.wrapperHeight){
      setTimeout(()=>{
        querySelector(
            () => this.createSelectorQuery().select(this.yoName).boundingClientRect(),
            ([rect]:any) => rect.height,
        ).then(([rect]: any) => {
          this.wrapperHeight = rect.height ;
        })
      });
    }
  }
  show() {
    if(this.useExist&&!this.exist)this.exist=true;
    if(!this.useExist&&!this.visible)this.visible=true;
    this.queryHeight();
  }
  hide(this: any) {
    if(!this.wrapperHeight)return;
    if(this.useExist&&this.exist)this.exist=false;
    if (!this.useExist&&this.visible) this.visible=false;
  }
}
</script>

<style scoped lang="scss"></style>
