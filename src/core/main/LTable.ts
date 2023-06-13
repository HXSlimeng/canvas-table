import { dft } from "../default";
import {
  anyObj,
  ILTableInitOptions,
  ItableColumn,
  IColumnMap,
  IheaderOption,
  IbodyOption,
} from "../index.d";
import { CanvasCtx } from "./CanvasCtx";
import { Cell, ScrollBar } from "./index";

export class Table extends CanvasCtx {
  header: TableHeader;
  body: TableBody;
  scrollBar: ScrollBar;

  constructor(dom: HTMLCanvasElement, options: ILTableInitOptions) {
    super(dom, options.size);

    const { column, columnH } = options;

    const { cellH: dftH, cellW: dftW } = dft;

    let colH = columnH || dftH;

    this.header = new TableHeader(this.ctx, column, { cellH: colH });
    this.body = new TableBody(this.ctx, this.header.columnMap, { colH });
    this.scrollBar = new ScrollBar(this.ctx, colH, () => this.afterScroll());
    // this.style.scrollWidth = options.column.reduce(
    //   (a, b) => b.width || dftW + a,
    //   0
    // );

    this.header.render();
  }

  resetData() {
    // this.cellData = [];
    // this.tableData = [];
  }

  // get scrollHeight() {
  //   if (this.body) {
  //     const { rows, cellH } = this.body
  //     return rows.length * cellH
  //   }
  //   return 0
  // }

  set data(data: anyObj[]) {
    this.body.setData(data);
    this.scrollBar.scrollHeight = data.length * this.body.cellH;
  }

  afterScroll() {
    this.body.render();
    this.header.fixPosition(this.scrollBar.scrollTop);
  }

  // setScroll() {
  // let ifShowScrollY = this.scrollHeight + this.header!.height > this.style.height
  // this.scrollBar.showScrollY = ifShowScrollY
  // }
}

export class TableHeader {
  columnMap: IColumnMap = new Map();
  ctx: CanvasRenderingContext2D;
  cells: Cell[];
  metaData: ItableColumn[];
  height: number;
  width: number;
  headerStyle = {
    bgColor: "#f5f7fa",
    fontColor: "#909399",
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    columns: ItableColumn[],
    option?: IheaderOption
  ) {
    this.metaData = columns;
    this.ctx = ctx;
    this.height = option?.cellH || dft.cellH;
    {
      let totalW = 0;

      this.cells = columns.map(({ title, prop, width }, x) => {
        let caculateW = width || option?.cellW || dft.cellW;
        let caculateH = this.height;

        let startX = x * caculateW;
        let rectParmas = {
          iX: x,
          iY: 0,
          text: title,
          width: caculateW,
          height: caculateH,
          startX,
          startY: 0,
        };

        this.columnMap.set(prop, { startX, width: caculateW, iX: x });
        totalW += caculateW;

        return new Cell(this.ctx, rectParmas, this.headerStyle);
      });
      this.width = totalW;
    }
    //tbHeader宽度
  }

  render() {
    this.cells.forEach((cell) => cell.render());
  }

  fixPosition(scrollTop: number) {
    this.cells.forEach((cell) => {
      cell.rectParams.startY = scrollTop;
      cell.render();
    });
  }
}
export class TableBody {
  ctx: CanvasRenderingContext2D;
  rows: Row[] = [];
  colMap: IColumnMap;
  cellH: number;
  headerH: number;

  private style = {
    bgColor: "white",
    fontColor: "black",
  };
  constructor(
    ctx: CanvasRenderingContext2D,
    colMap: IColumnMap,
    option: IbodyOption
  ) {
    this.ctx = ctx;
    this.colMap = colMap;
    this.cellH = option?.cellH || dft.cellH;
    this.headerH = option.colH;
    // setStyle(this.ctx.canvas, { 'zIndex': '20', position: 'relative' })
    this.eventHandler();
  }

  setData(data: anyObj[]) {
    data.forEach((row, y) => {
      let rowItem: Cell[] = [];
      Object.entries(row).forEach(([key, val]) => {
        const col = this.colMap.get(key);

        if (col) {
          const { startX, width, iX } = col;

          let rectParmas = {
            iX,
            iY: y,
            text: val,
            startX,
            startY: this.headerH + y * this.cellH,
            width,
            height: this.cellH,
          };

          // this.cells
          rowItem.push(new Cell(this.ctx, rectParmas, this.style));
        }
      });
      this.rows.push(new Row(rowItem, row));
    });
    this.render();
  }

  private get on() {
    return this.ctx.canvas;
  }
  private get off() {
    return this.ctx.canvas.removeEventListener;
  }

  eventHandler() {
    this.ctx.canvas.addEventListener("mousemove", (e) => {
      //toggle active by hover
      {
        const { offsetY } = e;

        let preAct = this.rows.find((v) => v.active);

        let activeIndex = (offsetY - this.headerH) / this.cellH;

        let finIndex = parseInt(activeIndex.toString());

        if (preAct === this.rows[finIndex]) return;
        if (preAct) preAct.active = false;
        if (this.rows[finIndex].active != true)
          this.rows[finIndex].active = true;
      }
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
