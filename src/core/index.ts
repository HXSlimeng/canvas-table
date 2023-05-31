import { Table } from "./TableMain";
import { ICanvasInitOptions } from "./index.d";

type IsetupTableMt = (dom: HTMLCanvasElement | string, options?: ICanvasInitOptions) => Table;

export const setUpTable: IsetupTableMt = (dom, options) => {
  const tbInstance = new Table(dom);
  tbInstance.setSize(options?.size);
  return tbInstance;
};
