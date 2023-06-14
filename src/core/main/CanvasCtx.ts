import { dft } from "../default";
import { ILTableInitOptions } from "../index.d";
import { addClass, rtf } from "../utils";
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
    addClass(this.el, 'canvas-root')
    this.setCanvasSize(size);
    // this.setSize()
  }

  setCanvasSize(size: ILTableInitOptions["size"]) {
    const { el } = this;
    const { w: defaultW, h: defaultH } = dft;
    let cfgW: number, cfgH: number;
    this.style.width = cfgW = size?.width || defaultW;
    this.style.height = cfgH = size?.height || defaultH;

    el.width = rtf(cfgW)
    el.height = rtf(cfgH)

    el.setAttribute("style", `width:${cfgW}px;height:${cfgH}px;`);

    return this;
  }

  setSize() {
    const { el } = this
    const parentElement = el.parentElement
    if (parentElement) {
      const { width, height } = parentElement.getBoundingClientRect()
      let cfgW: number, cfgH: number;
      this.style.width = cfgW = width;
      this.style.height = cfgH = height;

      el.width = rtf(cfgW)
      el.height = rtf(cfgH)

      el.setAttribute("style", `width:${cfgW}px;height:${cfgH}px;`);
    }
  }

  // clearDraw(startPoint, endPoint) {
  //   const { height, width } = this.style;
  //   this.ctx.clearRect(0, 0, width, height);
  // }

}
