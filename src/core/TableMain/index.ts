import { ICanvasInitOptions, ICellParams, ItableColumn } from "../index.d";

const dft = {
  w: 800,
  h: 800,
  cellW: 50,
  cellH: 20,
  strokeStyle: "#8f8f8f",
};

// let defaultW = 800;
// let defaultH = 600;
export class canvasCtx {
  ctx: CanvasRenderingContext2D | null = null;
  el: HTMLCanvasElement | null = null;
  constructor(dom: HTMLCanvasElement | string) {
    if (typeof dom === "string") {
      this.el = <HTMLCanvasElement>document.querySelector(dom);
    } else {
      this.el = dom;
    }
    this.ctx = this.el.getContext("2d");
  }
  setSize(size: ICanvasInitOptions["size"]) {
    const { el } = this;
    if (!el) return this;
    const { w: defaultW, h: defaultH } = dft;
    el.width = size?.width || defaultW;
    el.height = size?.height || defaultH;
    return this;
  }
}

export class Cell extends canvasCtx {
  private defaultW = dft.cellW;
  private defaultH = dft.cellH;
  constructor(dom: HTMLCanvasElement | string) {
    super(dom);
  }
  drawCell(rectParams: ICellParams) {
    const { ctx, defaultW, defaultH } = this;
    const { x, y, width, height } = rectParams;

    ctx?.strokeRect(x, y, width || defaultW, height || defaultH);
  }
}

export class Table extends Cell {
  constructor(dom: HTMLCanvasElement | string) {
    super(dom);
  }

  drawTbHeader(cols: ItableColumn[]) {}
}

// export class Cell {
//   width = dft.cellW;
//   height = dft.cellH;
//   constructor(position: ICellPos) {}
// }
