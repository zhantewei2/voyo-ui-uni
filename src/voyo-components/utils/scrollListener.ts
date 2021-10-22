import {merge, Observable, of, Subject} from "rxjs";
import {debounceTime, mergeMap} from "rxjs/operators";

export interface ScrollOpts{
  scrollTop:number;
  scrollHeight:number;
}

export class ScrollListener{
  scrollSubject:Subject<ScrollOpts>=new Subject();
  subject:Observable<ScrollOpts>;
  scroll(e:any){
    this.scrollSubject.next(e.detail);
  }
  
  init(component:any,scrollViewSelector:string,scrollViewRefName:string){
    //@ts-ignore
    const nodeOffset=uni.createSelectorQuery().in(component).select(scrollViewSelector).scrollOffset();
    
    this.subject=merge(
      of({scrollTop:0,scrollHeight:0}),
      this.scrollSubject,
      this.scrollSubject.pipe(
        debounceTime(150),
        mergeMap(()=>{
          return new Observable<ScrollOpts>((ob)=>{
            // #ifdef MP-WEIXIN
            nodeOffset.exec(([r]:any)=>{
              ob.next(r);
              ob.complete();
            })
            // #endif
            // #ifdef ENV-H5
            const scrollViewEl=(component.$refs as any)[scrollViewRefName];
            ob.next({
              scrollTop: scrollViewEl.scrollTop,
              scrollHeight: scrollViewEl.scrollHeight
            })
            ob.complete();
            // #endif
          })
        })
      )
    )
  }
}