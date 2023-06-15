import { ICellParams, ICellStyle } from "../index.d";
import { dft } from "./../default";
import { RATIO, rtf } from "../utils/index";

export class Cell {
  rectParams: ICellParams;
  cellStyle: ICellStyle
  ctx: CanvasRenderingContext2D;
  active = false;
  private activeStyle = {
    bgColor: dft.actBgColor,
    fontColor: dft.actFtColor,
    font: ''
  };

  constructor(
    ctx: CanvasRenderingContext2D,
    rectParams: ICellParams,
    cellStyle?: ICellStyle
  ) {
    this.rectParams = rectParams;
    this.cellStyle = cellStyle || { fontColor: dft.fontColor, bgColor: dft.bgColor };
    this.ctx = ctx;
  }

  get drawParams() {
    const { startX, startY, width, height, text } = this.rectParams;
    return {
      text,
      startX: rtf(startX),
      startY: rtf(startY),
      width: rtf(width || dft.cellW),
      height: rtf(height || dft.cellH),
    };
  }

  render() {
    const { startX, startY, text, height, width } = this.drawParams;
    const { bgColor, fontColor, font } = this.active
      ? this.activeStyle
      : this.cellStyle;

    const { ctx } = this;

    // this.clear();

    ctx.save();
    //单元格边框
    ctx.fillStyle = bgColor || dft.bgColor;
    ctx.strokeStyle = dft.borderColor;
    ctx.strokeRect(startX, startY, width, height);
    ctx.fillRect(startX, startY, width, height);

    // ctx.globalCompositeOperation = 'destination-over'

    //单元格文本
    ctx.font = `${font || ''} ${RATIO}rem sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fontColor || dft.fontColor;
    ctx.fillText(text, startX + width / 2, startY + height / 2);

    ctx.restore();
  }

  clear() {
    const { startX, startY, width, height } = this.drawParams;
    this.ctx.clearRect(startX, startY, width, height);
  }

}
