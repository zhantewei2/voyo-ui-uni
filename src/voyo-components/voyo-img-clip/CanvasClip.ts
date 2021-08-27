declare const uni: any;

export class CanvasClip {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(height: number, width: number) {
    this.canvas = uni.createOffscreenCanvas();
    this.canvas.height = height;
    this.canvas.width = width;
    console.log(this.canvas);
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    console.log("ctx", this.ctx);
  }
  getImgData(
    imgSource: any,
    x: number,
    y: number,
    width: number,
    height: number,
  ): string {
    this.ctx.drawImage(imgSource, x, y, width, height);
    return this.canvas.toDataURL();
  }
}
