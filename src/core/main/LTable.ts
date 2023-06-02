import { dft } from "../default";
import { anyObj, ILTableInitOptions, ItableColumn, IColumnMap, IheaderOption, IbodyOption } from "../index.d";
import { CanvasCtx } from "./CanvasCtx";
import { Cell } from "./Cell";

export class Table extends CanvasCtx {
  header: TableHeader | undefined = undefined;
  body: TableBody | undefined = undefined;

  constructor(dom: HTMLCanvasElement | string, options: ILTableInitOptions) {
    super(dom, options.size);

    if (!this.ctx) return;

    const { cellH: dftH, cellW: dftW } = dft;

    let colH = options.columnH || dftH;

    this.header = new TableHeader(options.column, this.ctx, { cellH: colH });
    this.body = new TableBody(this.ctx, this.header.columnMap, { colH });

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

  constructor(columns: ItableColumn[], ctx: CanvasRenderingContext2D, option?: IheaderOption) {
    this.metaData = columns;
    {
      let currPosX = 0;

      this.cells = columns.map(({ title, prop, width }, x) => {
        let caculateW = width || option?.cellW || dft.cellW;
        let caculateH = option?.cellH || dft.cellH;

        let startX = x * caculateW;
        let rectParmas = { iX: x, iY: 0, text: title, width: caculateW, height: caculateH, startX, startY: 0 };

        this.columnMap.set(prop, { startX, width: caculateW, iX: x });
        currPosX += caculateW;

        return new Cell(rectParmas, this.headerStyle);
      });
      this.width = currPosX;
    }
    //tbHeader宽度
    this.ctx = ctx;
  }

  render() {
    this.cells.forEach((cell) => cell.render(this.ctx!));
  }

  get maxWidth() {
    return;
  }
}
export class TableBody {
  ctx: CanvasRenderingContext2D;
  cells: Cell[];
  colMap: IColumnMap;
  cellH: number;
  headerH: number;
  bodyStyle = {
    bgColor: "white",
    fontColor: "black",
  };
  constructor(ctx: CanvasRenderingContext2D, colMap: IColumnMap, option: IbodyOption) {
    this.ctx = ctx;
    this.cells = [];
    this.colMap = colMap;
    this.cellH = option?.cellH || dft.cellH;
    this.headerH = option.colH;
  }

  setData(data: anyObj[]) {
    let currPoxH = this.headerH;

    data.forEach((row, y) => {
      Object.entries(row).forEach(([key, val]) => {
        const col = this.colMap.get(key);

        if (col) {
          const { startX, width, iX } = col;

          let rectParmas = { iX, iY: y, text: val, startX, startY: this.headerH + y * currPoxH, width, height: this.cellH };

          this.cells.push(new Cell(rectParmas, this.bodyStyle));
        }
      });
    });
  }

  render() {
    this.cells.forEach((v) => v.render(this.ctx));
  }
}
