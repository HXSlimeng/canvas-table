import { Cell } from ".";
import { IColumnMap, IbodyOption, anyObj } from "../table";
import { dft } from "../default";
import { Row } from "./Row";
import { SignStr } from "../enum/default";

export class TableBody {
    rows: Row[] = [];
    cellH: number;
    headerH: number;
    currentRenderRows: Row[] = []

    private style = {
        bgColor: dft.bgColor,
        fontColor: dft.fontColor,
    };

    constructor(
        public ctx: CanvasRenderingContext2D,
        public colMap: IColumnMap,
        option: IbodyOption
    ) {
        this.cellH = option.cellH || dft.cellH;
        this.headerH = option.colH;
    }

    setData(data: anyObj[]) {
        this.rows = []
        let selectable = this.colMap.has(SignStr.SELECTABLE)

        data.forEach((row, y) => {
            let rowItem: Cell[] = [];

            if (selectable) {
                row[SignStr.SELECTABLE] = false
            }

            Object.entries(row).forEach(([key, val]) => {
                const col = this.colMap.get(key);
                if (col) {
                    const { startX, width, iX, render } = col;

                    let rectParmas = {
                        iX,
                        iY: y + 1,
                        content: val,
                        startX,
                        startY: this.headerH + y * this.cellH,
                        width,
                        height: this.cellH,
                    };
                    // this.cells

                    rowItem.push(new Cell(this.ctx, rectParmas, [key, val], this.style, render));
                }
            });
            this.rows.push(new Row(rowItem, row));
        });
        this.render();
    }

    get visibleRangeData() {
        const { f: minY } = this.ctx.getTransform()
        const { height } = this.ctx.canvas
        const maxY = -minY + height

        return this.rows.filter(row => {
            return row.rowRangeMin <= maxY && row.rowRangeMin >= -minY
        })
    }
    clear() {
        this.rows.forEach(row => row.clear())
    }

    render() {
        //render前将缓存的图像clear
        this.currentRenderRows.forEach(row => row.clear())
        this.currentRenderRows = this.visibleRangeData

        this.currentRenderRows.forEach(row => row.render())

    }
}