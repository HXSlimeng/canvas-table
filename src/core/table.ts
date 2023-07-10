import { Row } from "./main/Row";

export type ICellContent = boolean | string | SVGAElement | HTMLImageElement

/**
 * renderFun 生成内容的方法
 * event [eventKey，在render内容（如icon）内点击或其他行为的cb，在cell内不在render内容中的事件触发cb]
 */
export type IRenderContent = {
  renderFun: (val: any, index: number) => ICellContent,
  event?: [keyof HTMLElementEventMap, (row: Row, dataRows: Row[]) => void, Function?][],
  size: {
    width: number,
    height: number
  }
  click?: boolean
}

export interface ItableColumn {
  title: string | boolean;
  prop: string;
  width?: number;
  render?: IRenderContent[] | IRenderContent,
  headRender?: IRenderContent[] | IRenderContent
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
    render?: IRenderContent[] | IRenderContent
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
