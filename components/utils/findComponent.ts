import Vue from "vue";
const TabGroupName="voyo-tab-group";
const TabName="voyo-tab";
const TabsName="voyo-tabs";
const TabbarsName="voyo-tabbars";
const TabbarName="voyo-tabbar";


const findComponent=(componentInstance:Vue,componentName:string):Vue|undefined=>
  componentInstance.$data.componentName===componentName?componentInstance:undefined;

const isTabGroup=(componentInstance:Vue)=>findComponent(componentInstance,TabGroupName);

const isTabs=(i:Vue)=>findComponent(i,TabsName);

const isTab=(i:Vue)=>findComponent(i,TabName);

const isTabbars=(i:Vue)=>findComponent(i,TabbarsName);

const isTabbar=(i:Vue)=>findComponent(i,TabbarName);

const findFromList=(list:Vue[],name:string):Vue|undefined=>{
  for(let i of list){
    if(findComponent(i,name))return i;
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
  findFromList
}
