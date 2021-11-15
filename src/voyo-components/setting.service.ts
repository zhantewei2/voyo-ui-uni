import { PaginationSetting } from "./voyo-pg/voyo-pg.lib";
import {Subject} from "./utils/Subject";
declare let getApp: any;
const app = getApp() || {};
const VoyoSettingKey = "voyo-setting";

const voyoSetting = app[VoyoSettingKey] || (app[VoyoSettingKey] = {});
const advanceSetting = <T extends Object>(obj: T): T => {
  for (let key in obj) {
    voyoSetting[key] = obj[key];
    Object.defineProperty(obj, key, {
      set(v) {
        voyoSetting[key] = v;
      },
      get() {
        return voyoSetting[key];
      },
    });
  }
  return obj;
};

export class Setting {
  btnBehaviorRecord?: boolean; //开启按钮行为记录
  btnBehaviorRecordSubject: Subject<any>=new Subject<any>();
  loadImg: string = "";  // voyo-load 加载图
  loadDelay: number=50; // voyo-load 延迟出现
  loadBlockImg: string = ""; // voyo-load block模式加载图
  imgLoadImg: string = "";  //voyo-img 加载图
  loginImg: string = "";
  errorImg: string = "";
  emptyImg: string = "";
  popupCloseIconClassName: string = "";
  selectIconClassName:string="ui-uni ui-uni-active"; //选中icon样式名.
  //@ts-ignore;
  paginationSetting:Record<'default'|string, PaginationSetting<any>>;
  vfRotateImgs: string[] = [];
  vfRotateSuccessImg: string = "";
  vfRotateFailImg: string = "";
  refresh = {
    itemIcon: "",
    itemText: "下拉刷新",
    runIcon: "",
    runText: "刷新中",
    triggerIcon: "",
    triggerText: "释放刷新",
    successIcon: "",
    successText: "刷新成功",
  };
  relativeFixedSpace:number= 10;
  cell={
    linkIcon:"ui-uni ui-uni-right",
    selectIcon: "ui-uni ui-uni-select",
    border:true,
  }
}

const setting = advanceSetting(new Setting());
//disable contextmenu
// if(document)document.oncontextmenu=()=>false;
export { setting };
