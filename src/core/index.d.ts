export interface ItableColumn {
  title: string;
  prop: string;
}

export interface ICanvasInitOptions {
  size?: {
    width: number;
    height: number;
  };
  column: ItableColumn[];
}

export interface ICellParams {
  x: number;
  y: number;
  width?: number;
  height?: number;
}
