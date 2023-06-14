import { Cell } from ".";
import { IColumnMap, IbodyOption, anyObj } from "../index.d";
import { dft } from "../default";
import { Row } from "./Row";

export class TableBody {
    ctx: CanvasRenderingContext2D;
    rows: Row[] = [];
    colMap: IColumnMap;
    cellH: number;
    headerH: number;
    currentRenderRows: Row[] = []

    private style = {
        bgColor: dft.bgColor,
        fontColor: dft.fontColor,
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

    get visibleRangeData() {
        const { f: minY } = this.ctx.getTransform()
        const { height } = this.ctx.canvas
        const maxY = -minY + height

        return this.rows.filter(row => {
            return row.rowRangeMin <= maxY && row.rowRangeMin >= -minY
        })
    }

    render() {
        //render前将缓存的图像clear
        this.currentRenderRows.forEach(row => row.clear())
        this.currentRenderRows = this.visibleRangeData

        this.currentRenderRows.forEach(row => row.render())

    }
}