import {Observable,from} from "rxjs";
import {retryWhen,delay} from "rxjs/operators";
import {Align, Rect} from "./relativeFixed";


export const querySelectorOb=(
  queryFn:any,
  judgePassFn:any,
  delayTime = 50,
  retryCount = 4
)=>{
  let retryCurrentCount = 0;
  return new Observable((ob) => {
    queryFn().exec((result:any) => {
      retryCurrentCount++ < retryCount && !judgePassFn(result)
        ? ob.error("Judgement Failure")
        : ob.next(result);
    });
  }).pipe(retryWhen((s) => s.pipe(delay(delayTime))))
}

export const getSelectRect=(
  {component,detail,autoAlign=true,baseAlignWidth=150,baseAlign='right',cb,queryCondition}: {
    component: any,
    detail: { x: number, y: number },
    queryCondition:string,
    autoAlign?: boolean,
    baseAlignWidth?: number,
    baseAlign?:string,
    cb: (p: { rect: Rect, align: Align }) => void
  }
  )=>
  querySelectorOb(
    ()=>(uni.createSelectorQuery().in(component).select(queryCondition)as any).boundingClientRect(),
    (([rect]:any)=>rect&&rect.width)
  ).subscribe(([rect]:any)=>{
    let align:Align;
    if(autoAlign&&rect.width>=baseAlignWidth){
      const x=detail.x-rect.left;
      align=x<rect.width/2?"left":"right";
    }else{
      align=baseAlign as Align;
    }
    cb({
      rect,
      align
    });
  });

/**
 * 小程序mounted  dom被创建后，低端机型，偶尔需要延迟才能获得rect.
 * @param queryFn
 * @param judgePassFn
 * @param delayTime
 * @param retryCount
 */
export const querySelector = (
  queryFn:any,
  judgePassFn:any,
  delayTime = 50,
  retryCount = 4,
) => {
  return new Promise((resolve,reject)=>{
    querySelectorOb(queryFn,judgePassFn,delayTime,retryCount).subscribe(resolve, reject)
  })
 
};