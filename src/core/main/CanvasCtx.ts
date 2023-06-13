import { dft } from "../default";
import { ILTableInitOptions } from "../index.d";
import { RATIO } from "../../utils";
export class CanvasCtx {
  ctx: CanvasRenderingContext2D;
  el: HTMLCanvasElement;
  style = {
    height: 0,
    width: 0,
  };

  constructor(dom: HTMLCanvasElement, size: ILTableInitOptions["size"]) {
    this.el = dom;

    this.ctx = <CanvasRenderingContext2D>this.el.getContext("2d");
    // this.ctx.globalCompositeOperation = 'destination-over'
    this.setCanvasSize(size);
  }

  setCanvasSize(size: ILTableInitOptions["size"]) {
    const { el } = this;
    const { w: defaultW, h: defaultH } = dft;
    let cfgW: number, cfgH: number;
    this.style.width = cfgW = size?.width || defaultW;
    this.style.height = cfgH = size?.height || defaultH;

    el.width = cfgW * RATIO;
    el.height = cfgH * RATIO;

    el.setAttribute("style", `width:${cfgW}px;height:${cfgH}px;`);

    return this;
  }

  clearDraw(startPoint, endPoint) {
    const { height, width } = this.style;
    this.ctx.clearRect(0, 0, width, height);
  }

  // //平移
  // move(x: number, y: number) {
  //   this.style.scrollLeft = x;
  //   this.style.scrollTop += y;
  //   this.ctx.translate(x, -y);
  // }
}
