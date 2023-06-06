import { dft } from "../default";
import { ILTableInitOptions } from "../index.d";
import { RATIO } from "../../utils";
export class CanvasCtx {
  ctx: CanvasRenderingContext2D | null = null;
  //   ctxW: number = 0;
  //   ctxH: number = 0;
  el: HTMLCanvasElement | null = null;
  style = {
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    height: 0,
    width: 0,
  };

  constructor(dom: HTMLCanvasElement | string, size: ILTableInitOptions["size"]) {
    if (typeof dom === "string") {
      this.el = <HTMLCanvasElement>document.querySelector(dom);
    } else {
      this.el = dom;
    }
    try {
      this.ctx = this.el.getContext("2d");
      this.setCanvasSize(size);
    } catch (error) {
      throw new Error("Init canvas dom error");
    }
  }

  setCanvasSize(size: ILTableInitOptions["size"]) {
    const { el } = this;
    const { w: defaultW, h: defaultH } = dft;

    if (!el) return this;
    let cfgW: number, cfgH: number;

    cfgW = size?.width || defaultW;
    cfgH = size?.height || defaultH;

    this.style.height = el.width = cfgW * RATIO;
    this.style.height = el.height = cfgH * RATIO;

    el.setAttribute("style", `width:${cfgW}px;height:${cfgH}px;`);

    return this;
  }

  clearDraw(startPoint, endPoint) {
    const { height, width } = this.style;
    this.ctx?.clearRect(0, 0, width, height);
  }

  //平移
  move(x: number, y: number) {
    this.style.scrollLeft = x;
    this.style.scrollTop = y;
    this.ctx?.translate(x, y);
  }
}
