import { PaginationSetting } from "./voyo-pg/voyo-pg.lib";
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
  loadImg: string = "";  // voyo-load 加载图
  loadBlockImg: string = ""; // voyo-load block模式加载图
  imgLoadImg: string = "";  //voyo-img 加载图
  loginImg: string = "";
  errorImg: string = "";
  emptyImg: string = "";
  popupCloseIconClassName: string = "";
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
}

const setting = advanceSetting(new Setting());

export { setting };
