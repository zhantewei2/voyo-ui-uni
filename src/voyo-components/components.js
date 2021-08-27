import Button from "./voyo-button/voyo-button.vue";
import ButtonIcon from "./voyo-button-icon/voyo-button-icon.vue";
import Empty from "./voyo-empty/voyo-empty.vue";
import Img from "./voyo-img/voyo-img.vue";
import ImgClip from "./voyo-img-clip/voyo-img-clip.vue";
import Input from "./voyo-input/voyo-input.vue";
import Keyboard from "./voyo-keyboard/voyo-keyboard.vue";
import Line from "./voyo-line/voyo-line.vue";
import Load from "./voyo-load/voyo-load.vue";
import LoadError from "./voyo-load-error/voyo-load-error.vue";
import Modal from "./voyo-modal/voyo-modal.vue";
import PaginationBase from "./voyo-pagination-base/voyo-pagination-base.vue";
import Pg from "./voyo-pg/voyo-pg.vue";
import Popup from "./voyo-popup/voyo-popup.vue";
import Refresh from "./voyo-refresh/voyo-refresh.vue";
import Ripple from "./voyo-ripple/voyo-ripple.vue";
import SideBar from "./voyo-sidebar/voyo-sidebar.vue";
import SideBarItem from "./voyo-sidebar-item/voyo-sidebar-item.vue";
import Tab from "./voyo-tab/voyo-tab.vue";
import TabGroup from "./voyo-tab-group/voyo-tab-group.vue";
import TabPage from "./voyo-tab-page/voyo-tab-page.vue";
import Tabbar  from "./voyo-tabbar/voyo-tabbar.vue";
import Tabbars from "./voyo-tabbars/voyo-tabbars.vue";
import Tabs from "./voyo-tabs/voyo-tabs.vue";
import VfInput from "./voyo-vf-input/voyo-vf-input.vue";
import VfRotate from "./voyo-vf-rotate/voyo-vf-rotate.vue";

export const voyoModule={
  name:"voyo-module",
  installed:false,
  install(vue){
    if(this.installed)return;
    vue.component("voyo-button",Button);
    vue.component("voyo-button-icon",ButtonIcon);
    vue.component("voyo-empty",Empty);
    vue.component("voyo-img",Img);
    vue.component("voyo-img-clip",ImgClip);
    vue.component("voyo-input",Input);
    vue.component("voyo-keyboard",Keyboard);
    vue.component("voyo-line",Line);
    vue.component("voyo-load",Load);
    vue.component("voyo-load-error",LoadError);
    vue.component("voyo-modal",Modal);
    vue.component("voyo-pagination-base",PaginationBase);
    vue.component("voyo-pg",Pg);
    vue.component("voyo-popup",Popup);
    vue.component("voyo-refresh",Refresh);
    vue.component("voyo-ripple",Ripple);
    vue.component("voyo-sidebar",SideBar);
    vue.component("voyo-sidebar-item",SideBarItem);
    vue.component("voyo-tab",Tab);
    vue.component("voyo-tab-group",TabGroup);
    vue.component("voyo-tab-page",TabPage);
    vue.component("voyo-tabbar",Tabbar);
    vue.component("voyo-tabbars",Tabbars);
    vue.component("voyo-tabs",Tabs);
    vue.component("voyo-vf-input",VfInput);
    vue.component("voyo-vf-rotate",VfRotate);
  }
};

