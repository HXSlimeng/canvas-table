import { Cell } from ".";
import { IColumnMap, ItableColumn, IheaderOption } from "../index.d";
import { dft } from "../default";

export class TableHeader {
    columnMap: IColumnMap = new Map();
    ctx: CanvasRenderingContext2D;
    cells: Cell[];
    metaData: ItableColumn[];
    height: number;
    width: number;
    headerStyle = {
        bgColor: "#242424",
        fontColor: dft.fontColor,
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

    //在重绘时固定表头
    fixPosition(scrollTop: number) {
        this.cells.forEach((cell) => {
            cell.rectParams.startY = scrollTop;
            cell.render();
        });
    }
}