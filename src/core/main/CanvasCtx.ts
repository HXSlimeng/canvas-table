import { ILTableInitOptions } from "../table";
import { addClass, rtf, setStyle } from "../utils";
export class CanvasCtx {
  ctx: CanvasRenderingContext2D;
  root: HTMLElement;
  canvasEl: HTMLCanvasElement
  style = {
    height: 0,
    width: 0,
  };
  size: ILTableInitOptions["size"]

  constructor(dom: HTMLElement, size: ILTableInitOptions["size"]) {
    this.root = dom;
    this.size = size

    let canvasDom = document.createElement('canvas')
    this.ctx = canvasDom.getContext("2d")!;
    this.canvasEl = canvasDom

    this.root.append(canvasDom)
    addClass(this.root, 'canvas-root')

    this.setCanvasSize();
  }

  setCanvasSize() {
    let { f, e } = this.ctx.getTransform()
    const { canvasEl, root, size } = this;
    const { width, height } = root.getBoundingClientRect()


    let cfgW: number, cfgH: number;
    this.style.width = cfgW = size?.width || width;
    this.style.height = cfgH = size?.height || height;

    canvasEl.width = rtf(cfgW)
    canvasEl.height = rtf(cfgH)

    setStyle(canvasEl, {
      width: `${cfgW}px`,
      height: `${cfgH}px`
    })

    //改变尺寸后同步之前的transform
    this.ctx.setTransform({ f, e })

    return this;
  }
}
