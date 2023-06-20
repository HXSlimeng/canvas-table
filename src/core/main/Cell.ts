import { ICellContent, ICellParams, ICellStyle } from "../table";
import { dft } from "./../default";
import { RATIO, dertf, getType, rtf } from "../utils/index";
import { restoreCtx } from "../descriptor";

type cellInfo = [string, number | string]
export class Cell {
  rectParams: ICellParams;
  defaultStyle: ICellStyle
  ctx: CanvasRenderingContext2D;
  active = false;
  fitText: string | null = null
  private cellInfo: cellInfo
  private activeStyle = {
    bgColor: dft.actBgColor,
    fontColor: dft.actFtColor,
    font: ''
  };
  private contentRender?: (val: any, index: number) => ICellContent

  constructor(
    ctx: CanvasRenderingContext2D,
    rectParams: ICellParams,
    info: [string, number | string],
    cellStyle?: ICellStyle,
    contentRender?: (val: any, index: number) => ICellContent
  ) {
    this.rectParams = rectParams;
    this.defaultStyle = cellStyle || { fontColor: dft.fontColor, bgColor: dft.bgColor };
    this.ctx = ctx;
    this.cellInfo = info;
    this.contentRender = contentRender
  }

  get drawParams() {
    const { startX, startY, width, height, content } = this.rectParams;
    return {
      content,
      startX: rtf(startX),
      startY: rtf(startY),
      width: rtf(width || dft.cellW),
      height: rtf(height || dft.cellH),
    };
  }

  get cellStyle() {
    return this.active ? this.activeStyle : this.defaultStyle;
  }

  get key() {
    return this.cellInfo[0]
  }

  get value() {
    return this.cellInfo[1]
  }

  set value(val: any) {
    this.cellInfo[1] = val
    this.rectParams.content = val
  }

  getFitText(text: string) {
    const { ctx, drawParams: { width }, fitText } = this

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
    this.drawBorder()
    this.drawContent()
  }

  @restoreCtx
  drawBorder() {
    const { ctx } = this
    const { startX, startY, height, width } = this.drawParams;
    const { bgColor } = this.cellStyle
    //单元格边框
    ctx.fillStyle = bgColor || dft.bgColor;
    ctx.strokeStyle = dft.borderColor;
    ctx.strokeRect(startX, startY, width, height);
    ctx.fillRect(startX, startY, width, height);
  }


  drawContent() {
    const { content } = this.drawParams

    if (this.contentRender) {
      const { iY } = this.rectParams
      this.drawItem(this.contentRender(this.value, iY))
    } else if (Array.isArray(content)) {
      content.forEach(item => this.drawItem(item))
    } else {
      this.drawItem(content)
    }
    // ctx.fillText(fitText, startX, startY);
  }
  @restoreCtx
  drawItem(content: ICellParams['content'] | ICellParams['content'][]) {
    const { ctx } = this
    const { startX, startY, width, height } = this.drawParams

    if (getType(content) === 'string') {
      const { fontColor, font } = this.cellStyle
      const fitText = this.getFitText(content as string)
      ctx.font = `${font || ''} ${RATIO}rem sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fontColor || dft.fontColor;
      ctx.fillText(fitText, startX + width / 2, startY + height / 2);

    } else if (content instanceof HTMLImageElement) {
      if (!content.complete) {
        content.addEventListener('load', () => {
          ctx.drawImage(content, startX + width / 2 - dertf(content.width), startY + height / 2 - dertf(content.height))
        })
      } else {
        ctx.drawImage(content, startX + width / 2 - dertf(content.width), startY + height / 2 - dertf(content.height))
      }
    }
  }

  clear() {
    const { startX, startY, width, height } = this.drawParams;
    this.ctx.clearRect(startX, startY, width, height);
  }

}
