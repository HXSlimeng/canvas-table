import { ICellParams, ICellStyle } from "../index.d";
import { dft } from "./../default";
import { RATIO } from "../../utils";

export class Cell {
  rectParams: ICellParams;
  renderValue: any;
  cellStyle: ICellStyle = {
    bgColor: dft.bgColor,
    fontColor: dft.fontColor,
  };

  constructor(rectParams: ICellParams, cellStyle?: ICellStyle) {
    this.rectParams = rectParams;
    cellStyle && (this.cellStyle = cellStyle);
  }

  get drawParams() {
    const { rtf } = this;
    const { startX, startY, width, height, text } = this.rectParams;
    return {
      text,
      startX: rtf(startX),
      startY: rtf(startY),
      width: rtf(width || dft.cellW),
      height: rtf(height || dft.cellH),
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    const { startX, startY, text, height, width } = this.drawParams;
    const { bgColor, fontColor } = this.cellStyle;

    //单元格边框
    ctx.fillStyle = bgColor || dft.bgColor;
    ctx.strokeStyle = dft.borderColor;
    ctx.strokeRect(startX, startY, width, height);
    ctx.fillRect(startX, startY, width, height);

    //单元格文本
    ctx.font = `${RATIO}rem sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fontColor || dft.fontColor;
    ctx.fillText(text, startX + width / 2, startY + height / 2, width);
  }
  rtf(params: number) {
    return params * RATIO;
  }
}
