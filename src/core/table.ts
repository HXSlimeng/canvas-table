import { Row } from "./main/Row";

export type ICellContent = string | SVGAElement | HTMLImageElement

export type IRenderContent = {
  renderFun: (val: any, index: number) => ICellContent,
  event?: [keyof HTMLElementEventMap, (row: Row) => void][],
  size: {
    width: number,
    height: number
  }
}

export interface ItableColumn {
  title: string;
  prop: string;
  width?: number;
  render?: IRenderContent[]
}

export interface ILTableInitOptions {

  columns: ItableColumn[];
  columnH?: number;
  headerBackGround?: string;
  selectable?: boolean
}

export interface ICellParams {
  //列
  iX: number;
  //行
  iY: number;
  //开始点
  startX: number;
  //结束点
  startY: number;
  width?: number;
  height?: number;
  content: ICellContent;
}

export interface ICellStyle {
  bgColor?: string;
  fontColor?: string;
  font?: string
}

export type IColumnMap = Map<
  string,
  {
    width: number;
    startX: number;
    iX: number;
    render?: IRenderContent[]
  }
>;

export type tableBaseOption = {
  cellH?: number;
  cellW?: number;
};

export type IheaderOption = tableBaseOption & { columns: ItableColumn[], selectable: boolean | undefined };
export type IbodyOption = tableBaseOption & {
  colH: number;
};

export interface anyObj {
  [key: string]: any;
}

export type IEventMapFun = <K extends keyof HTMLElementEventMap>(type: K, event: HTMLElementEventMap[K]) => void
