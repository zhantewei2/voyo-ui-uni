declare var uni: any;

export interface SystemInfo{
  language: string;
  model: string;
  pixelRatio: number;
  platform: string;
  safeArea: Record<any, any>;
  safeAreaInsets: Record<any, any>;
  screenHeight: number;
  screenWidth: number;
  statusBarHeight: number;
  system: string;
  windowBottom: number;
  windowHeight: number;
  windowTop: number;
  windowWidth: number;
  pageHeaderHeight: number;
}

const systemInfo:SystemInfo = uni.getSystemInfoSync() as any;
const platform = systemInfo.platform;
const pageHeaderHeight = 50;
const pageHeaderTotalH = pageHeaderHeight + systemInfo.statusBarHeight;
const isH5=!!window;
systemInfo["pageHeaderHeight"]=50;

export { systemInfo, platform, pageHeaderHeight, pageHeaderTotalH ,isH5};
