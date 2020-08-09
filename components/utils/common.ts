declare var uni: any;

const systemInfo = uni.getSystemInfoSync();
const platform = systemInfo.platform;
const pageHeaderHeight = 50;
const pageHeaderTotalH = pageHeaderHeight + systemInfo.statusBarHeight;
export { systemInfo, platform, pageHeaderHeight, pageHeaderTotalH };
