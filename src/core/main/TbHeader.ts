import { Cell } from ".";
import { IColumnMap, ItableColumn, IheaderOption } from "../table";
import { dft } from "../default";
import { DftSize, SignStr } from "../enum/default";
import { Row } from "./Row";
export class TableHeader {
    columnMap: IColumnMap = new Map();
    ctx: CanvasRenderingContext2D;
    cells: Cell[];
    row: Row
    height: number;
    width: number;
    headerStyle = {
        bgColor: "#262727",
        fontColor: "#A3A6AD",
        font: 'bold'
    };
    selectedRows: Row[] = []

    constructor(
        ctx: CanvasRenderingContext2D,
        option: IheaderOption
    ) {
        this.ctx = ctx;
        const { cellH, cellW, columns, selectable } = option
        this.height = cellH || dft.cellH;

        //setup columns
        {
            let totalW = 0;

            this.setSelected(columns, selectable)

            this.cells = columns.map(({ title, prop, width, render, headRender }, x) => {

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

                return new Cell(this.ctx, rectParmas, [prop, title], this.headerStyle, headRender);
            });

            this.row = new Row(this.cells, { isHeader: true })
            this.width = totalW;
        }
        //tbHeader宽度
    }

    render() {
        this.row.render()
    }

    setSelected(columns: ItableColumn[], selectable: boolean = false) {
        let check = document.createElement('img')
        check.src = '/src/icons/check.svg'
        let uncheck = document.createElement('img')
        uncheck.src = '/src/icons/unCheck.svg'

        if (selectable) {
            let selectedIconRender = (val: boolean) => {
                let dom = val ? check : uncheck
                return dom
            }
            let size = {
                width: 32,
                height: 32
            }

            let cursorEvt = [['mousemove',
                () => {
                    document.body.style.cursor = 'pointer'
                },
                () => {
                    document.body.style.cursor = 'auto'
                }
            ],
            ['mouseleave', () => { }]]

            columns.unshift({
                title: false,
                prop: SignStr.SELECTABLE,
                width: DftSize.SELECT_CELL_W,
                render: {
                    renderFun: selectedIconRender,
                    event: [
                        ['click', (row, dataRows) => {
                            row.selected = !row.selected
                            //head selected 当数据选择发生变化时
                            let allSelectedStatus = true
                            let selectedRows = []
                            for (let i = 0; i < dataRows.length; i++) {
                                const row = dataRows[i];
                                if (!row.selected) {
                                    allSelectedStatus && (allSelectedStatus = false)
                                } else {
                                    selectedRows.push(row)
                                }
                            }
                            this.selectedRows = selectedRows
                        }],
                        ...cursorEvt as any
                    ],
                    size
                }
                ,
                headRender: {
                    renderFun: selectedIconRender,
                    event: [
                        ['click', (row, dataRows) => {
                            let resultSelected = !row.selected
                            let selectedRow = []
                            for (let i = 0; i < dataRows.length; i++) {
                                const row = dataRows[i];
                                row.selected = resultSelected
                                resultSelected && selectedRow.push(row)
                            }
                            row.selected = resultSelected
                        }],
                        ...cursorEvt as any
                    ],
                    size
                }

            })
        }
        return columns
    }

    //在重绘时固定表头
    fixPosition(scrollTop: number) {
        this.row.cells.forEach((cell) => {
            cell.rectParams.startY = scrollTop;
            cell.render();
        });
    }
}