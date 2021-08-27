import {getScrollParent,getScrollDistanceFromNode,checkAndSetOffsetNode} from "@ztwx/utils/lib/web/scroll";
import {ExcuteAfterConnected} from "./excuteAfterConnected";

export interface ObserveRunOpts{
  visible:boolean;
  unsubscribe:()=>void;
}
export type ObserveRun=(opts:ObserveRunOpts)=>void;

export interface BaseIntersection{
  observe(el:HTMLElement,run:ObserveRun):{
    unsubscribe:()=>void
  };
  mounted(mountedEl:HTMLElement):void;
  disconnect():void;
}

export class VisibleScrollItem{
  el:HTMLElement;
  visible:boolean;
  distanceTop:number;
  distanceBottom:number;
  observerRun?:ObserveRun;
}

class VisibleScroll implements BaseIntersection{
  scrollParent:HTMLElement;
  scrollHandler:any;
  scrollListenerEl:HTMLElement|Window;
  observe(el: HTMLElement,observerRun:ObserveRun): { unsubscribe: () => void } {
    const distanceTop = getScrollDistanceFromNode(el,this.scrollParent);
    const item:VisibleScrollItem={
      el,
      distanceTop,
      distanceBottom:distanceTop+el.scrollHeight,
      observerRun,
      visible:false
    }
    this.observerList.push(item);
    return {
      unsubscribe:()=>this.unsubscribe(item)
    }
  }

  unsubscribe(item:VisibleScrollItem){
    const itemIndex=this.observerList.findIndex(i=>i.el===item.el);
    if(itemIndex>=0)this.observerList.splice(itemIndex,1);
  }
  disconnect=()=>{
    if(this.scrollListenerEl){
      this.scrollListenerEl.removeEventListener("scroll",this.scrollHandler);
      this.observerList=[];
    }
  }

  observerList:Array<VisibleScrollItem>=[];
  mounted(mountedEl: HTMLElement): void {
    this.scrollParent=getScrollParent(mountedEl);
    checkAndSetOffsetNode(this.scrollParent);
    let scrollTop:number;
    let scrollBottom:number;
    let scrollHeight=this.scrollParent.clientHeight;
    this.scrollListenerEl=this.scrollParent===document.documentElement?window:this.scrollParent;
    this.scrollHandler=(e:Event)=>{
      scrollTop=this.scrollParent.scrollTop;
      scrollBottom=scrollTop+scrollHeight;
      this.observerList.forEach(i=>{
        if(
          (scrollBottom>=i.distanceTop&&scrollTop<i.distanceBottom&&!i.visible)
          ||(scrollBottom<i.distanceTop&&scrollTop>=i.distanceBottom&&i.visible)
        ){
          i.visible=!i.visible;
          i.observerRun&&i.observerRun({
            visible:i.visible,
            unsubscribe:()=>this.unsubscribe(i)
          })
        }
      })
    }
    this.scrollListenerEl.addEventListener("scroll",this.scrollHandler)
  }
}
class VisibleIntersection implements BaseIntersection{
  mainObserver:IntersectionObserver;
  elKeyName:string="voyo-scroll-intersection-order";
  mounted(mountedEl: HTMLElement): void {

  }
  observe(el: HTMLElement|any, run: ObserveRun): { unsubscribe: () => void } {
    this.mainObserver.observe(el);
    el[this.elKeyName]=run;
    return {
      unsubscribe:()=>this.unsubscribe(el)
    }
  }
  unsubscribe(el:any){
    try{
      this.mainObserver.unobserve(el)
    }catch (e) {

    }
  }
  disconnect(): void {
    this.mainObserver&&this.mainObserver.disconnect();
  }
  constructor() {
    this.mainObserver=new IntersectionObserver((entries:IntersectionObserverEntry[])=>{
      entries.forEach((entry:any)=>{
        const runFn:ObserveRun=entry.target[this.elKeyName];
        if(runFn)runFn({
          visible:entry.isIntersecting,
          unsubscribe:()=>this.unsubscribe(entry.target)
        })
      })
    },{root:null,threshold:0})
  }
}

export const createScrollIntersection=():BaseIntersection=>IntersectionObserver?new VisibleIntersection():new VisibleScroll();