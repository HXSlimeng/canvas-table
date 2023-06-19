import { ICellParams, ICellStyle } from "../table";
import { dft } from "./../default";
import { RATIO, rtf } from "../utils/index";

export class Cell {
  rectParams: ICellParams;
  cellStyle: ICellStyle
  ctx: CanvasRenderingContext2D;
  active = false;
  fitText: string | null = null
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
  getFitText() {
    const { ctx, drawParams: { width, text }, fitText } = this

    if (fitText) return fitText

    let textW = ctx.measureText(text).width

    if (textW <= width) {
      this.fitText = text
      return text
    } else {
      let len = 0
      let i = 0
      let str = ''
      let ellipsis = '...'
      do {
        i++
        str = text.slice(0, i)
        len = ctx.measureText(str + ellipsis).width
      } while (len >= width);
      this.fitText = str + ellipsis
      return str
    }
  }

  render() {
    const { startX, startY, height, width } = this.drawParams;
    const { bgColor, fontColor, font } = this.active
      ? this.activeStyle
      : this.cellStyle;

    const { ctx } = this;

    const fitText = this.getFitText()



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
    ctx.fillText(fitText, startX + width / 2, startY + height / 2);

    ctx.restore();
  }

  clear() {
    const { startX, startY, width, height } = this.drawParams;
    this.ctx.clearRect(startX, startY, width, height);
  }

}
