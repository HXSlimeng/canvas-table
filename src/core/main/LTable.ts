import { dft } from "../default";
import { anyObj, ILTableInitOptions, ItableColumn, IColumnMap, IheaderOption, IbodyOption } from "../index.d";
import { CanvasCtx } from "./CanvasCtx";
import { Cell, ScrollBar } from "./";

export class Table extends CanvasCtx {
  header: TableHeader | undefined = undefined;
  body: TableBody | undefined = undefined;
  scrollBar: ScrollBar | undefined = undefined;

  constructor(dom: HTMLCanvasElement | string, options: ILTableInitOptions) {
    super(dom, options.size);

    if (!this.ctx) return;

    const { column, columnH } = options;

    const { cellH: dftH, cellW: dftW } = dft;

    let colH = columnH || dftH;

    this.header = new TableHeader(this.ctx, column, { cellH: colH });
    this.body = new TableBody(this.ctx, this.header.columnMap, { colH });
    this.scrollBar = new ScrollBar(dom, colH);
    this.style.scrollWidth = options.column.reduce((a, b) => b.width || dftW + a, 0);

    this.header.render();
  }

  resetData() {
    // this.cellData = [];
    // this.tableData = [];
  }

  // drawCol(cols: ItableColumn[]) {
  //   const {} = this.ctx!.getTransform();
  //   // console.log(transForm);
  //   this.columns = cols;
  // }
  scroll() {
    this.ctx?.translate(0, -1);
    // this.drawCol(this.columns);
    // this.setData(this.totalData);
    // this.ctx?.translate(1000, 0);
  }

  set data(data: anyObj[]) {
    this.body?.setData(data);
    this.body?.render();
  }

  repaint() {
    // this.setData(this.tableData);
    // this.columns = this.columnInfo;
  }
}

export class TableHeader {
  columnMap: IColumnMap = new Map();
  ctx: CanvasRenderingContext2D;
  cells: Cell[];
  metaData: ItableColumn[];
  width: number;
  headerStyle = {
    bgColor: "#f5f7fa",
    fontColor: "#909399",
  };

  constructor(ctx: CanvasRenderingContext2D, columns: ItableColumn[], option?: IheaderOption) {
    this.metaData = columns;
    this.ctx = ctx;
    {
      let currPosX = 0;

      this.cells = columns.map(({ title, prop, width }, x) => {
        let caculateW = width || option?.cellW || dft.cellW;
        let caculateH = option?.cellH || dft.cellH;

        let startX = x * caculateW;
        let rectParmas = { iX: x, iY: 0, text: title, width: caculateW, height: caculateH, startX, startY: 0 };

        this.columnMap.set(prop, { startX, width: caculateW, iX: x });
        currPosX += caculateW;

        return new Cell(this.ctx, rectParmas, this.headerStyle);
      });
      this.width = currPosX;
    }
    //tbHeader宽度
  }

  render() {
    this.cells.forEach((cell) => cell.render());
  }

  get maxWidth() {
    return;
  }
}
export class TableBody {
  ctx: CanvasRenderingContext2D;
  rows: Row[] = [];
  colMap: IColumnMap;
  cellH: number;
  headerH: number;
  bodyStyle = {
    bgColor: "white",
    fontColor: "black",
  };
  constructor(ctx: CanvasRenderingContext2D, colMap: IColumnMap, option: IbodyOption) {
    this.ctx = ctx;
    this.colMap = colMap;
    this.cellH = option?.cellH || dft.cellH;
    this.headerH = option.colH;
    this.eventHandler();
  }

  setData(data: anyObj[]) {
    data.forEach((row, y) => {
      let rowItem: Cell[] = [];
      Object.entries(row).forEach(([key, val]) => {
        const col = this.colMap.get(key);

        if (col) {
          const { startX, width, iX } = col;

          let rectParmas = { iX, iY: y, text: val, startX, startY: this.headerH + y * this.cellH, width, height: this.cellH };

          // this.cells
          rowItem.push(new Cell(this.ctx, rectParmas, this.bodyStyle));
        }
      });
      this.rows.push(new Row(rowItem, row));
    });
  }

  get on() {
    return this.ctx.canvas;
  }
  get off() {
    return this.ctx.canvas.removeEventListener;
  }
  eventHandler() {
    this.on.addEventListener("mousemove", (e) => {
      const { offsetY } = e;

      let preAct = this.rows.find((v) => v.active);

      let activeIndex = (offsetY - this.headerH) / this.cellH;

      let finIndex = parseInt(activeIndex.toString());

      if (preAct === this.rows[finIndex]) return;
      if (preAct) preAct.active = false;
      if (this.rows[finIndex].active != true) this.rows[finIndex].active = true;
    });
  }

  render() {
    this.rows.forEach((v) => v.render());
  }
}

export class Row {
  rowInfo: anyObj;
  cells: Cell[];
  private rowActive = false;
  constructor(cells: Cell[], info: anyObj) {
    this.rowInfo = info;
    this.cells = cells;
  }
  render() {
    this.cells.forEach((v) => v.render());
  }
  set active(val: boolean) {
    this.rowActive = val;
    this.cells.forEach((cell) => {
      cell.active = val;
      cell.render();
    });
  }
  get active(): boolean {
    return this.rowActive;
  }
}
