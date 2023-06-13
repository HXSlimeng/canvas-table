export interface ItableColumn {
  title: string;
  prop: string;
  width?: number;
}

export interface ILTableInitOptions {
  size?: {
    width: number;
    height: number;
  };
  column: ItableColumn[];
  columnH?: number;
  headerBackGround?: string;
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
  text: string;
}

export interface ICellStyle {
  bgColor?: string;
  fontColor?: string;
}

export type IColumnMap = Map<
  string,
  {
    width: number;
    startX: number;
    iX: number;
  }
>;

export type tableBaseOption = {
  cellH?: number;
  cellW?: number;
};

export type IheaderOption = tableBaseOption & {};
export type IbodyOption = tableBaseOption & {
  colH: number;
};

export interface anyObj {
  [key: string]: any;
}

export type IEventMapFun = <K extends keyof HTMLElementEventMap>(type: K, event: HTMLElementEventMap[K]) => void
