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
  iX: number;
  iY: number;
  startX: number;
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
