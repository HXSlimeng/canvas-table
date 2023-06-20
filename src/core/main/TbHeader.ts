import { Cell } from ".";
import { IColumnMap, ItableColumn, IheaderOption } from "../table";
import { dft } from "../default";
import { DftSize, SignStr } from "../enum/default";
export class TableHeader {
    columnMap: IColumnMap = new Map();
    ctx: CanvasRenderingContext2D;
    cells: Cell[];
    metaData: ItableColumn[];
    height: number;
    width: number;
    headerStyle = {
        bgColor: "#262727",
        fontColor: "#A3A6AD",
        font: 'bold'
    };

    constructor(
        ctx: CanvasRenderingContext2D,
        option: IheaderOption
    ) {
        this.ctx = ctx;
        const { cellH, cellW, columns, selectable } = option
        this.metaData = columns;
        this.height = cellH || dft.cellH;
        {
            let totalW = 0;

            let check = document.createElement('img')
            check.src = '/src/icons/check.svg'
            let uncheck = document.createElement('img')
            uncheck.src = '/src/icons/unCheck.svg'
            //     uncheck.onload = () => {
            // let check = new Promise((resolve, reject) => {
            //     let check = document.createElement('img')
            //     check.src = '/src/icons/check.svg'
            //     check.onload = () => {
            //         resolve(check)
            //     }
            // })
            // let uncheck = new Promise((resolve, reject) => {
            //     let uncheck = document.createElement('img')
            //     uncheck.src = '/src/icons/unCheck.svg'
            //     uncheck.onload = () => {
            //         resolve(uncheck)
            //     }
            // })
            // Promise.all([check, uncheck]).then(([check, uncheck]) => {

            // })
            if (selectable) {
                let contentRender = (val: boolean, i: number) => {
                    let dom = val ? check : uncheck
                    return dom
                }
                columns.unshift({
                    title: '选择',
                    prop: SignStr.SELECTABLE,
                    width: DftSize.SELECT_CELL_W,
                    render: contentRender
                })
            }

            this.cells = columns.map(({ title, prop, width, render }, x) => {

                let caculateW = width || cellW || dft.cellW;
                let caculateH = this.height;

                let startX = totalW;
                let rectParmas = {
                    iX: x,
                    iY: 0,
                    content: title,
                    width: caculateW,
                    height: caculateH,
                    startX,
                    startY: 0,
                };

                this.columnMap.set(prop, { startX, width: caculateW, iX: x, render });
                totalW += caculateW;

                return new Cell(this.ctx, rectParmas, [prop, title], this.headerStyle);
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