import Vue from "vue";
import { isH5 } from "../utils";

const VoyoSlotKey="data-voyo-type";
const TabGroupName="voyo-tab-group";
const TabName="voyo-tab";
const TabsName="voyo-tabs";
const TabbarsName="voyo-tabbars";
const TabbarName="voyo-tabbar";
const TabSlotName="voyo-tab-slot-wrapper";

const findComponent=(componentInstance:Vue,componentName:string):Vue|undefined=>
  componentInstance.$data.componentName===componentName?componentInstance:undefined;

const findParentTarget=(parent:Vue,componentName:string):Vue|undefined=>{
  if(parent.$data.componentName===componentName)return parent;
  return parent.$parent?findParentTarget(parent.$parent,componentName):undefined;
}

const findParentComponent=(componentInstance:Vue,componentName:string,SlotNodeType:string):Vue|undefined=>{
  if(!isH5){
    return findComponent(componentInstance,componentName);
  }else{
    const instance=findComponent(componentInstance,componentName);
    if(instance)return instance;

    if(componentInstance.$el&&componentInstance.$el.getAttribute("data-voyo-type")===SlotNodeType){
      return findParentTarget(componentInstance.$parent,componentName);
    }else{
      return undefined;
    }
  }
}

const isTabGroup=(componentInstance:Vue)=>findComponent(componentInstance,TabGroupName);

const isTabs=(i:Vue)=>findComponent(i,TabsName);

const isTab=(i:Vue)=>findComponent(i,TabName);

const isTabbars=(i:Vue)=>findComponent(i,TabbarsName);

const isTabbar=(i:Vue)=>findComponent(i,TabbarName);

const isTabParent=(i:Vue)=>findParentComponent(i,TabName,TabSlotName);

const findChildrenFromList=(instance:Vue,name:string):Vue|undefined=>{
  if(!isH5){
    for(let child of instance.$children){
      if(findComponent(child,name))return child;
    }
  }else{
    if(!instance.$slots.default)return;
    for(let vNode of instance.$slots.default){
      if(findComponent(vNode.componentInstance as Vue,name))return vNode.componentInstance;
    }
  }
};

export {
  TabGroupName,
  TabName,
  TabsName,
  TabbarsName,
  TabbarName,
  isTabGroup,
  isTabs,
  isTab,
  isTabbars,
  isTabbar,
  isTabParent,
  findChildrenFromList
}
