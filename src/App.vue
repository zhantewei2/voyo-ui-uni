<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            console.log('App Launch')
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>

<style lang="scss">
@use "~@voyo/core-style/lib/components/checkbox/checkbox";
page{
  --color-primary: #00A0E2;
  --color-primary2: #12b6e2;
  --color-secondary: rgb(0, 0, 0);
  --color-success:#07c160;
  --color-warn:#ff976a;
  --color-error: #ee0a24;
  --color-disabled: #ececec;
  --color-gentle:rgb(100,100,100);

  --color-primary-light: #1BC6E2;
  --color-primary2-light: #52c4e3;
  --color-secondary-light: rgb(230,230,230);
  --color-success-light:#07c160;
  --color-warn-light:#ff976a;
  --color-error-light:#ee0a24;
  --color-disabled-light: #f6f6f6;
  --color-gentle-light:rgb(240,240,240);

  --color-primary-gentle: rgba(0, 160, 226,.1);
  --color-primary2-gentle:  rgba(0, 160, 186,.1);
  --color-secondary-gentle:rgba(100,100,100,.1);
  --color-success-gentle:rgba(0,255,255,.1);
  --color-warn-gentle:rgba(255,255,0,0.1);
  --color-error-gentle:rgba(255,0,0,.1);
  --color-gentle-gentle:rgba(130,130,130,.1);

  --color-primary-font: white;
  --color-primary2-font: white;
  --color-secondary-font:white;
  --color-success-font: white;
  --color-warn-font:white;
  --color-error-font:white;
  --color-gentle-font:white;
  --color-disabled-font:gainsboro;
  --color-disabled-border:gainsboro;

  --color-bg:white;
  --color-bg2:#FAFAFA;
  --color-bg3:#F7F8FA;
  --color-bg4:rgba(255,255,255,.9);
  --color-bg5:rgba(255,255,255,.5);
  --color-bg6:rgba(255,255,255,.7);
  --color-bg-opacity: rgba(255,255,255,.5);
  --color-bg-opacity2: rgba(255,255,255,.8);
  --color-bg-deep:black;
  --color-bg-deep2: #373737;
  --color-bg-deep3:rgba(0,0,0,0.4);
  --color-bg-deep4:rgba(0,0,0,0.8);
  --color-border-neut:rgb(150,150,150);
  --color-after-border: rgb(230,230,230);
  --color-border-light:rgb(249,249,249);
  /*page header bg*/
  --color-header-bg: var(--color-bg);
  /*base color*/
  --color-font-base:#333333;

  /*brand color*/
  --color-font-brand:#000000;
  --color-font-brand-reverse:white;
  /*description color*/
  --color-font-des: #98a5aa;
  --color-font-des-reverse:rgba(255,255,255,0.6);
  /*light color  lighten than des*/
  --color-font-light:#CCCCCC;
  --color-font-white:white;
  --color-font-dark:#333333;
  /*content color*/
  --color-font-content:#666666;
  /*title color*/
  --color-font-title:#333333;
  --color-font-title-reverse:rgb(249,249,249);
  /*brand color*/
  --color-font-assist:#999999;
  /*ripple-deep*/
  --color-ripple-deep-bg:rgba(255,255,255,.2);
  --color-ripple-deep-hover:rgba(255,255,255,.3);
  --color-ripple-deep-bubbling:rgb(255,255,255);
  /*ripple-light*/
  --color-ripple-light-bg:rgba(50,50,50,.1);
  --color-ripple-light-hover:rgba(0,0,0,.1);
  --color-ripple-light-bubbling:rgba(0,0,0,.6);
  --size-font:16px;
  --size-font-message:16px;
  --size-font-title:18px;
  --size-font-small:13px;
  --size-font-content:14px;
  --size-mini:12px;
  --size-small:14px;
  --size-now:16px;
  --size-medium:18px;
  --size-strong:20px;
  --size-large:23px;
  --space-base:5px;
  --radius-base:5px;
  --radius-medium:10px;
  --radius-large:25px;
  --page-header-h:3.4rem;
  --shadow-color:rgba(197, 180, 180, 0.2);
  --shadow-color-tabbar:rgba(197, 180, 180, 0.2);
  --font-family:-apple-system,'STHeiti', 'Microsoft YaHei', Helvetica, Arial, sans-serif;
  --blur-size:10px;
  --load-cover-bg:transparent;
  font-size: var(--size-font);
}
@import "./static/css/voyo-ui-uni.css";
@import "~@voyo/core-style/lib/main";
@import "~@voyo/core-style/lib/components/select";
@import "~@voyo/core-style/lib/components/cell";
@import "~@voyo/core-style/lib/components/panel";

</style>
