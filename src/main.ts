import { ILTableInitOptions } from './core/table';
import { Table } from './core/main';
import { getType } from './core/utils';


import '../style.css'

type IsetupTableMt = (dom: HTMLCanvasElement | string, options: ILTableInitOptions) => Table;

export const setUpTable: IsetupTableMt = (dom, options) => {
    let canvasCtx
    if (getType(dom) === "string") {
        canvasCtx = document.querySelector(<string>dom);
    } else {
        canvasCtx = dom;
    }

    if (canvasCtx instanceof HTMLCanvasElement) {
        return new Table(canvasCtx, options);
    } else {
        throw new Error("Init canvas dom error")
    }
};






