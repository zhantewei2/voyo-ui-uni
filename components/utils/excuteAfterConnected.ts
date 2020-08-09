/**
 * uniapp bug 编译不过？毛病？
 */
export type ExcuteAfterConnectedWait=(() => void)|({
  uniqueKey: string;
  run: () => void;
})

export class ExcuteAfterConnected{
  isConnected: boolean;
  waitQueue: Array<ExcuteAfterConnectedWait>=[];
  connect=()=>{
    if(this.isConnected)return;
    this.waitQueue.forEach(i=>{
      if(typeof i ==="function"){
        i();
      }else{
        i.run();
      }
    });
    this.isConnected=true;
  };
  execute=(cb: () => void,uniqueKey?: string)=>{
    if(this.isConnected){
      cb();
    }else{
      if(uniqueKey){
        let index=0;
        for(let i of this.waitQueue){
          if(typeof i !=="function" &&i.uniqueKey===uniqueKey){
            this.waitQueue.splice(index,1);
            break;
          }
          index++;
        }
        this.waitQueue.push({
          uniqueKey,
          run:cb
        })
      }else{
        this.waitQueue.push(cb);
      }
    }
  }
}
