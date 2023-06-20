import { ILTableInitOptions } from './core/table';
import { Table } from './core/main';
import { getType } from './core/utils';


import '../style.css'

type IsetupTableMt = (dom: HTMLElement | string, options: ILTableInitOptions) => Table;

export const setupTable: IsetupTableMt = (dom, options) => {
    let root
    if (getType(dom) === "string") {
        root = document.querySelector(<string>dom);
    } else {
        root = dom;
    }

    if (root instanceof HTMLElement) {
        return new Table(root, options);
    } else {
        throw new Error("Init canvas dom error")
    }
};






