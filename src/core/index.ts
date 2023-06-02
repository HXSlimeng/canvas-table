import { Table } from "./main/LTable";
import { ILTableInitOptions } from "./index.d";

type IsetupTableMt = (dom: HTMLCanvasElement | string, options: ILTableInitOptions) => Table;

export const setUpTable: IsetupTableMt = (dom, options) => {
  const LTable = new Table(dom, options);

  return LTable;
};
