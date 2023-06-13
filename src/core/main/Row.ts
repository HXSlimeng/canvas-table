import { Cell } from ".";
import { anyObj } from "../index.d";

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
}