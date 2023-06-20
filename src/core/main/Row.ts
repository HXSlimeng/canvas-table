import { Cell } from ".";
import { SignStr } from "../enum/default";
import { anyObj } from "../table";

export class Row {
    rowInfo: anyObj;
    cells: Cell[];
    rowRangeMin: number
    private rowActive = false;
    constructor(cells: Cell[], info: anyObj) {
        this.rowInfo = info;
        this.cells = cells;

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
        let target = this.cells.find(cell => cell.key == 'select')
        if (target) {
            target.value = val
            target.render()
        }
    }

    get selected() {
        return this.rowInfo[SignStr.SELECTABLE]
    }
}