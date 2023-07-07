import { Cell } from ".";
import { SignStr } from "../enum/default";
import { anyObj } from "../table";

export class Row {
    rowRangeMin: number
    private rowActive = false;
    constructor(
        public cells: Cell[],
        public rowInfo: anyObj
    ) {

        const { drawParams: { startY } } = cells[0]
        this.rowRangeMin = startY

    }
    render() {
        this.cells.forEach((v) => v.render());
    }
    clear() {
        this.cells.forEach(cell => cell.clear())
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

    set selected(val: boolean) {
        this.rowInfo[SignStr.SELECTABLE] = val
        let target = this.cells.find(cell => cell.props == 'selected')

        if (target) {
            target.value = val
            this.render()
        }
    }

    get selected() {
        return this.rowInfo[SignStr.SELECTABLE]
    }
}