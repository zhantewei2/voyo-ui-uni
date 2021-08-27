import Vue from "vue";
import {isMobile} from "@ztwx/utils";
export interface RippleOpts{
    deep?: boolean;
    size?: number;
    css?: string;
    autoSize?: boolean;
    disabled?: boolean;
}

const baseSize=12;
const removeTime=400;
const removeEndTime=400;
const body=document.body;
export const autoSizeByWidth=(el: HTMLElement,defaultSize=30)=>{
    return el.offsetWidth?el.offsetWidth/6:defaultSize;
};

const switchClassName=(opts: RippleOpts): string=>{
    return opts.css?opts.css:(
        opts.deep?"ripple-wrapper-deep":"ripple-wrapper-light"
    );
};

export const handleRipple=(
    el: HTMLElement,
    opts: RippleOpts
)=>{
    let
        one: HTMLElement,
        rect: ClientRect,
        x: number,
        y: number,
        halfSize: number=baseSize/2,
        //已插入的ripple
        rippleQueue: HTMLElement[]=[],
        //删除Bubbling
        removeQueueTimeout: any,
        //删除touchend class:
        removeEndTimeout: any,
        clearRemoveQueue: Function=()=>{
            clearTimeout(removeQueueTimeout);
            removeQueueTimeout=null;
        },
        clearTouchEnd: Function=()=>{
            clearTimeout(removeEndTimeout);
            removeEndTimeout=null;
        };
    const wrapper=document.createElement('span');
    const className=switchClassName(opts);
    wrapper.classList.add('ripple-wrapper',className);
    el.appendChild(wrapper);
    const listenTouch=(e: any)=>{
        if(opts.disabled)return;
        el.classList.add("ripple-callback");
        rect=el.getBoundingClientRect();
        x=e.clientX-rect.left;
        y=e.clientY-rect.top;
        one=document.createElement('span');
        let fontSize: any;

        if(opts.size){
            fontSize=opts.size;
        }else if(opts.autoSize){
            fontSize=autoSizeByWidth(el);
        }
        if(fontSize){
            one.style.fontSize=fontSize+"px";
            halfSize=fontSize/2;
        }
        one.className='ripple-bubbling';

        one.style.left=x-halfSize+'px';
        one.style.top=y-halfSize+'px';

        rippleQueue.push(one);
        wrapper.appendChild(one);
        if(removeQueueTimeout)clearRemoveQueue();
        if(removeEndTime)clearTouchEnd();
        removeQueueTimeout=setTimeout(()=>{
            rippleQueue.forEach((child: HTMLElement)=>{
                wrapper.removeChild(child)
            });
            rippleQueue=[];
        },removeTime);
        wrapper.classList.add('ripple-active');
    };
    const touchEnd=()=>{
        el.classList.remove("ripple-callback");
        setTimeout(()=>wrapper.classList.remove('ripple-active'),removeEndTime);
    };
    if(isMobile){
        el.addEventListener('touchstart',(e: any)=>{
            listenTouch(e.touches[0]);
        },{passive:true});
        el.addEventListener('touchend',touchEnd,{passive:true});
    }else{
        el.addEventListener('mousedown',(e:any)=>{
            listenTouch(e);
            body.addEventListener('mouseup',function mouseUp(){
                touchEnd();
                body.removeEventListener('mouseup',mouseUp);
            });
        });
    }
    // el.addEventListener('contextmenu',e=>e.preventDefault());
};
