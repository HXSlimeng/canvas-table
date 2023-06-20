export type ICellContent = string | SVGAElement | HTMLImageElement
export interface ItableColumn {
  title: string;
  prop: string;
  width?: number;
  render?: (val: any, index: number) => ICellContent
}

export interface ILTableInitOptions {
  size?: {
    width: number;
    height: number;
  };
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
    render?: (val: any, index: number) => ICellContent
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
