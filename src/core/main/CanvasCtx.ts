import { ILTableInitOptions } from "../table";
import { addClass, rtf, setStyle } from "../utils";
export class CanvasCtx {
  ctx: CanvasRenderingContext2D;
  root: HTMLElement;
  canvasEl: HTMLCanvasElement

  constructor(dom: HTMLElement) {
    this.root = dom;

    let canvasDom = document.createElement('canvas')

    canvasDom.id = 'lmh-canvas'

    this.ctx = canvasDom.getContext("2d")!;
    this.canvasEl = canvasDom

    this.root.append(canvasDom)
    addClass(this.root, 'canvas-root')

    this.setCanvasSize();

  }

  setCanvasSize(scrollMaxInfo?: { scrollHeight: number, scrollWidth: number }) {
    let { f, e } = this.ctx.getTransform()
    const { canvasEl, root } = this;
    let { width: caculateW, height: caculateH } = root.getBoundingClientRect()

    if (scrollMaxInfo) {
      const { scrollHeight, scrollWidth } = scrollMaxInfo
      caculateH = caculateH > scrollHeight ? scrollHeight : caculateH
      caculateW = caculateW > scrollWidth ? scrollWidth : caculateW
    }

    canvasEl.width = rtf(caculateW)
    canvasEl.height = rtf(caculateH)

    setStyle(canvasEl, {
      width: `${caculateW}px`,
      height: `${caculateH}px`
    })

    //改变尺寸后同步之前的transform
    this.ctx.setTransform({ f, e })

    return this;
  }
}
