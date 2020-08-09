<template>
  <view class="abs-full voyo-img-clip-bg">
    <image
      :style="{
        transformOrigin: '0 0',
        position: 'absolute',
        top: imgTop + 'px',
        left: imgLeft + 'px',
        width: imgWidth + 'px',
        height: imgHeight + 'px',
      }"
      v-if="imgInitEnd"
      id="realImg"
      :src="img"
      class="abs-full"
    >
    </image>
    <image
      :style="{
        width: screenWidth + 'px',
        height: screenHeight + 'px',
      }"
      class="abs-full"
      :src="maskData"
    >
    </image>
    <view class="abs-full">
      <movable-area
        v-if="imgInitEnd"
        :style="{
          height: screenHeight + 'px',
          width: screenWidth + 'px',
        }"
        class="voyo-img-clip-area-shadow"
      >
        <movable-view
          id="moveView"
          class="voyo-img-clip-view-shadow"
          style="opacity: 0; position: absolute;"
          :style="{
            top: imgTop + 'px',
            left: imgLeft + 'px',
            height: imgHeight + 'px',
            width: imgWidth + 'px',
          }"
          @change="controller.moveChange"
          @scale="controller.scaleChange"
          :scale="true"
          :inertia="true"
          direction="all"
          :out-of-bounds="true"
          :scale-min="1"
        >
          <div class="abs-full" :src="img">x: {{ x }} y: {{ y }}</div>
        </movable-view>
      </movable-area>
      <image
        mode="widthFix"
        v-if="calImgShow"
        id="hiddenImg"
        @load="imgLoad"
        :style="{
          opacity: 0,
          width: imgWidth + 'px',
        }"
        :src="img"
      ></image>
    </view>
    <view class="voyo-img-clip-workspace p-2">
      <voyo-button size="small" type="candy" @tap="clipConfirm"
        >确定</voyo-button
      >
      <canvas
        class="voyo-img-clip-offCanvas"
        :style="{
          height: clipHeight + 'px',
          width: clipWidth + 'px',
        }"
        type="2d"
        id="canvasClip"
      >
      </canvas>
    </view>
  </view>
</template>
<script src="./voyo-img-clip.wxs" module="controller" lang="wxs"></script>
<script>
import { systemInfo } from "../utils";
import { Base64 } from "js-base64";

export default {
  props: {
    aspectRatio: {
      type: Number,
      default: 1,
    },
    clipWidthPercent: {
      type: Number,
      default: 0.7,
    },
    clipWidthMax: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      img: "http://120.26.38.9/static/icon/tool-imgs/1.jpg",
      screenWidth: systemInfo.windowWidth,
      screenHeight: systemInfo.windowHeight,
      calImgShow: false,
      imgInitEnd: false,
      imgWidth: 0,
      imgHeight: 0,
      imgTop: 0,
      imgLeft: 0,
      imgRight: 0,
      imgBottom: 0,
      clipWidth: 0,
      clipHeight: 0,
      clipLeft: 0,
      clipTop: 0,
      maskData: "",
    };
  },
  beforeCreate() {
    this.moveX = 0;
    this.moveY = 0;
    this.svgBg = "rgba(0,0,0,0.6)";
    this.recordX = 0;
    this.recordY = 0;
    this.recordScale = 1;
  },
  created() {
    this.clipWidth = this.getClipWidth();
    this.clipHeight = this.clipWidth * this.aspectRatio;
    this.clipLeft = (this.screenWidth - this.clipWidth) / 2;
    this.clipTop = (this.screenHeight - this.clipHeight) / 2;
    this.calImgSize();
  },
  methods: {
    recordState([x, y, scale]) {
      this.recordX = x;
      this.recordY = y;
      this.recordScale = scale;
    },

    getClipWidth() {
      let width = systemInfo.windowWidth * this.clipWidthPercent;
      if (width > this.clipWidthMax) width = this.clipWidthMax;
      return width;
    },

    calImgSize() {
      this.imgWidth = this.clipWidth;
      this.calImgShow = true;
    },
    imgLoad() {
      uni
        .createSelectorQuery()
        .in(this)
        .select("#hiddenImg")
        .boundingClientRect()
        .exec(([rect]) => {
          this.imgHeight = rect.height;
          this.imgLeft = this.clipLeft;
          this.imgTop = (this.screenHeight - this.imgHeight) / 2;
          this.imgBottom = this.imgTop + this.imgHeight;
          this.imgRight = this.imgLeft + this.imgWidth;
          this.imgInitEnd = true;
          this.drawMask();
        });
    },
    showMessage(...n) {
      console.log(...n);
    },
    drawMask() {
      this.maskData = this.getMaskBase64();
    },
    getMaskBase64() {
      const bg = `
<svg width="${this.screenWidth}" height="${this.screenHeight}"
  viewBox="0 0 ${this.screenWidth} ${this.screenHeight}"
  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <defs>
    <mask id="bgMask">
      <rect x="0" y="0" width="${this.screenWidth}" height="${this.screenHeight}" fill="white"></rect>
      <rect x="${this.clipLeft}" y="${this.clipTop}" width="${this.clipWidth}" height="${this.clipHeight}" fill="black"></rect>
    </mask>
  </defs>
  <rect x="0" y="0" width="${this.screenWidth}" height="${this.screenHeight}"
    fill="${this.svgBg}"
    mask="url(#bgMask)"
  ></rect>
</svg>`;
      return `data:image/svg+xml;base64,${Base64.encode(bg)}`;
    },
    clipConfirm() {
      this.exportImgData();
    },
    async exportImgData() {
      if (!this.canvasClip) {
        await new Promise((resolve, reject) => {
          uni
            .createSelectorQuery()
            .in(this)
            .select("#canvasClip")
            .fields({ node: true, size: true })
            .exec((res) => {
              this.canvasClip = res[0].node;
              this.canvasCtx = this.canvasClip.getContext("2d");
              this.canvasClip.width = this.clipWidth;
              this.canvasClip.height = this.clipHeight;
              resolve(true);
            });
        });
      }
      const tempPath = await new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.img,
          success(res) {
            resolve(res.tempFilePath);
          },
        });
      });
      const image = this.canvasClip.createImage();
      await new Promise((resolve, reject) => {
        image.onload = () => {
          resolve(true);
        };
        image.src = tempPath;
      });
      this.canvasCtx.clearRect(0, 0, this.clipWidth, this.clipHeight);
      this.canvasCtx.drawImage(
        image,
        this.recordX,
        this.recordY,
        this.imgWidth * this.recordScale,
        this.imgHeight * this.recordScale,
      );
      const data = this.canvasClip.toDataURL();
    },
  },
};
</script>

<style lang="scss" scoped>
.voyo-img-clip-bg {
  background: var(--color-bg-deep3);
}
.voyo-img-clip-workspace {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 499;
  background: var(--color-bg-deep3);
  text-align: right;
  width: 100%;
}
.voyo-img-clip-offCanvas {
  contain: layout;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(100%);
}
.voyo-img-clip-area-shadow {
  background: transparent;
}
.voyo-img-clip-view-shadow {
  position: absolute;
  opacity: 0;
  will-change: transform;
  touch-action: manipulation;
}
</style>
