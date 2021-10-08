import {setting} from "../setting.service";


export interface Rect{
  top:number;
  left:number;
  width:number;
  height:number;
}
export type Align="left"|"right";

export class RelativeFixed{
  containerOffset:number=10;
  
  switchOrigin(targetRect:Rect,contentRect:Rect,align:Align="right"):'tr'|'tl'|'br'|'bl'{
    const top=targetRect.top-contentRect.top;
    const bottom=contentRect.top+contentRect.height-(targetRect.top+targetRect.height);
    const left=targetRect.left-contentRect.left;
    const right=contentRect.left+contentRect.width - (targetRect.width+targetRect.left);
    const topStr=top>bottom?'b':'t';
    // console.log("111",left,right)
    // const leftStr=left>right?(align==='left'?'r':'l'):(align==='left'?'l':'r');
    const leftStr=Math.abs(left)<Math.abs(right)?'l':'r';
    // const leftStr=left>right?'l':'r';
    return topStr+leftStr as any;
  }

  
  switchPosition(
    {top,left,width:targetWidth,height:targetHeight}:Rect,
    {width,height}:Rect,
    screenRect:{width:number,height:number,space?:number,spaceTop:number},
    align: "left"|"right"="right"
    ):Rect{
    const {width:screenW,height:screenH,space=setting.relativeFixedSpace,spaceTop}=screenRect;
    const topBound=spaceTop,
      bottomBound=screenH-space,
      leftBound=space,
      rightBound=screenW-space;
    
    // const boundH=screenH - space*2;
    // const boundW=screenW - space*2;
    if(align==="right")left=left+targetWidth-width;
 
    if(top<topBound)top=topBound;
    if(left<leftBound)left=leftBound;
    let bottom=top+height;
    let right=left+width;
    if(align==="right"){
      left+=this.containerOffset;
      right+=this.containerOffset;
    }else{
      left-=this.containerOffset;
      right-=this.containerOffset
    }
    top-=this.containerOffset;
    bottom-=this.containerOffset;
    if(bottom>bottomBound)top=top-(bottom-bottomBound);
    if(right>rightBound)left= left-(right-rightBound);
   
    if(top<topBound)top=topBound;
    if(left<leftBound)left=leftBound;
    
    return {
      top,
      left,
      width,
      height
    }
  }
}

export const relativeFixed=new RelativeFixed();