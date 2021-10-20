import Vue, {VNode} from "vue";
import { isH5 } from "../utils";
import {findConf} from "@/requests/common/common.request";

const VoyoSlotKey="data-voyo-type";
const TabGroupName="voyo-tab-group";
const TabName="voyo-tab";
const TabsName="voyo-tabs";
const TabbarsName="voyo-tabbars";
const TabbarName="voyo-tabbar";
const TabSlotName="voyo-tab-slot-wrapper";
const TabsSlotName="voyo-tabs-slot-wrapper";

const findComponent=(componentInstance:Vue,componentName:string):Vue|undefined=>
  componentInstance.$data.componentName===componentName?componentInstance:undefined;

const findParentTarget=(parent:Vue,componentName:string):Vue|undefined=>{
  if(parent.$data.componentName===componentName)return parent;
  return parent.$parent?findParentTarget(parent.$parent,componentName):undefined;
}

const findParentComponent=(componentInstance:Vue,componentName:string,SlotNodeType:string):Vue|undefined=>{
  
  if(!isH5){

    return findParentTarget(componentInstance,componentName);
  }else{
    const instance=findComponent(componentInstance,componentName);
   
    if(instance)return instance;
    return findParentTarget(componentInstance.$parent,componentName);
  }
}

const isTabGroup=(componentInstance:Vue)=>findComponent(componentInstance,TabGroupName);

const isTabs=(i:Vue)=>findComponent(i,TabsName);

const isTab=(i:Vue)=>findComponent(i,TabName);

const isTabbars=(i:Vue)=>findComponent(i,TabbarsName);

const isTabbar=(i:Vue)=>findComponent(i,TabbarName);

const isTabParent=(i:Vue)=>findParentComponent(i,TabName,TabSlotName);

const isTabsParent=(i:Vue)=>findParentComponent(i,TabsName,TabsSlotName);

const findComponentChildren=(vNodes:VNode[],name:string,curDeep:number=1,deep:number=3):Vue|undefined=>{
  if(isH5){
    for(let i of vNodes){
      if(i.componentInstance && i.componentInstance.$data.componentName===name){
        return i.componentInstance;
      }
    }
    let componentInstance:any;
    if(curDeep>deep)return undefined;
    for(let i of vNodes){
      if(i.children){
        componentInstance=findComponentChildren(i.children,name,curDeep+1,deep);
        if(componentInstance)return componentInstance;
      }
    }
  }
  return undefined;
}

const findChildrenFromList=(instance:Vue,name:string,deep:number=4):Vue|undefined=>{
  if(!isH5){
    for(let child of instance.$children){
      if(findComponent(child,name))return child;
    }
  }else{
    if(!instance.$slots||!instance.$slots.default)return;
    
    return findComponentChildren(instance.$slots.default,name,1,deep);
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
  isTabsParent,
  findParentTarget,
  findParentComponent,
  findChildrenFromList
}
