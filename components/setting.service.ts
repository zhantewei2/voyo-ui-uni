import { PaginationSetting } from "./voyo-pg/voyo-pg.lib";
declare let getApp: any;
console.log("setting");
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
  loadImg: string = "";
  loadBlockImg: string = "";
  imgLoadImg: string = "";
  loginImg: string = "";
  errorImg: string = "";
  emptyImg: string = "";
  popupCloseIconClassName: string = "";
  paginationSetting: PaginationSetting<any>;
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
