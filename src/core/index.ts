import { Table } from "./main/LTable";
import { ILTableInitOptions } from "./index.d";
import { getType } from "../utils";

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
