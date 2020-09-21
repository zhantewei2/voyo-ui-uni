export interface GetClientRectParams{
  component?:any;
  querySelector?:string;
  el?:HTMLElement;

}

declare var window:any;
export const getClientRect=({component,querySelector,el}:GetClientRectParams):Promise<any>=>{
    if(window&&el){
      console.log(el);
      return Promise.resolve(el.getBoundingClientRect());
    }else if(!window&&component&&querySelector){
      return new Promise<any>((resolve,reject)=>{
        component.createSelectorQuery().select(querySelector).boundingClientRect().exec((res)=>resolve(res[0]))
      })
    }else{
      return Promise.resolve(false);
    }
};
