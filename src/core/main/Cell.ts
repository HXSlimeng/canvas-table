import { ICellContent, ICellParams, ICellStyle, IRenderContent, anyObj } from "../table";
import { dft } from "./../default";
import { RATIO, dertf, getType, isPointInRectRange, rtf } from "../utils/index";
import { restoreCtx } from "../descriptor";
import { Row } from "./Row";

type cellInfo = [string, number | string]
export class Cell {
  rectParams: ICellParams;
  defaultStyle: ICellStyle
  ctx: CanvasRenderingContext2D;
  active = false;
  fitText: string | null = null
  mouseOver = false
  eventInfo: {
    point: {
      offsetX: number,
      offsetY: number
    },
    currentRow: Row
  } | null = null
  private cellInfo: cellInfo
  private activeStyle = {
    bgColor: dft.actBgColor,
    fontColor: dft.actFtColor,
    font: ''
  };
  private contentRender?: IRenderContent[]
  private eventList: [keyof HTMLElementEventMap, (event: any) => void][]

  constructor(
    ctx: CanvasRenderingContext2D,
    rectParams: ICellParams,
    info: [string, number | string],
    cellStyle?: ICellStyle,
    contentRender?: IRenderContent[]
  ) {
    this.rectParams = rectParams;
    this.defaultStyle = cellStyle || { fontColor: dft.fontColor, bgColor: dft.bgColor };
    this.ctx = ctx;
    this.cellInfo = info;

    //处理事件绑定的callback
    this.contentRender = contentRender?.map(item => {
      let { width: cellW, height: cellH, startX, startY } = this.drawParams
      return {
        ...item,
        event: item.event?.map(([key, callback]) => {
          let managedCb = () => {
            let { currentRow, point } = this.eventInfo!
            const { width, height } = item.size

            let ctxW: number = width
            let ctxH: number = height

            let imgStartX = startX + cellW / 2 - ctxW / 2
            let imgStartY = startY + cellH / 2 - ctxH / 2
            if (isPointInRectRange([rtf(point.offsetX), rtf(point.offsetY + 50)], [imgStartX, imgStartY, width, height])) {
              callback(currentRow)
            }
          }
          return [key, managedCb]
        })
      }
    })

    if (contentRender) {
      //@ts-ignore
      this.eventList = contentRender.filter(v => v.event && v.event.length > 1).map(v => v.event).flat(1)
    } else {
      this.eventList = []
    }
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

  get tag() {
    const { iX, iY } = this.rectParams
    return `${iX}-${iY}`
  }

  get props() {
    return this.cellInfo[0]
  }

  get value() {
    return this.cellInfo[1]
  }

  set value(val: any) {
    this.cellInfo[1] = val
    // this.rectParams.content = val
  }

  set hovering(val: boolean) {
    this.mouseOver = val
    val ? this.eventOn() : this.eventOff()
  }

  get hovering() {
    return this.mouseOver
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
      this.contentRender.forEach(({ renderFun, size }) => {
        this.drawItem(renderFun(this.value, iY), { ...size })
      })
    } else if (Array.isArray(content)) {
      content.forEach(item => this.drawItem(item))
    } else {
      this.drawItem(content)
    }
    // ctx.fillText(fitText, startX, startY);
  }

  @restoreCtx
  drawItem(content: ICellParams['content'] | ICellParams['content'][], size?: { width: number, height: number }) {
    const { ctx } = this
    const { startX, startY, width: cellW, height: cellH } = this.drawParams

    if (getType(content) === 'string') {
      const { fontColor, font } = this.cellStyle
      const fitText = this.getFitText(content as string)
      ctx.font = `${font || ''} ${RATIO}rem sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = fontColor || dft.fontColor;
      ctx.fillText(fitText, startX + cellW / 2, startY + cellH / 2);

    } else if (content instanceof HTMLImageElement) {
      let ctxW: number = size?.width || content.width
      let ctxH: number = size?.height || content.height

      let imgStartX = startX + cellW / 2 - ctxW / 2
      let imgStartY = startY + cellH / 2 - ctxH / 2

      if (!content.complete) {
        content.addEventListener('load', () => {
          ctx.drawImage(content, imgStartX, imgStartY, ctxW, ctxH)
        })
      } else {
        ctx.drawImage(content, imgStartX, imgStartY, ctxW, ctxH)
      }
    }
  }

  onHover(row: Row, index: number) {
    this.render()
    // row.selected = true
  }

  eventOn() {
    let root = this.ctx.canvas.parentElement

    this.contentRender?.forEach(ctx => {

      if (ctx.event?.length) {

        ctx.event.forEach(([key, callback]) => {
          root?.addEventListener(key, callback as any)
        })
      }
    })

  }
  eventOff() {
    let root = this.ctx.canvas.parentElement
    this.contentRender?.forEach(ctx => {

      if (ctx.event?.length) {

        ctx.event.forEach(([key, callback]) => {
          root?.removeEventListener(key, callback as any)
        })
      }
    })
  }

  clear() {
    const { startX, startY, width, height } = this.drawParams;
    this.ctx.clearRect(startX, startY, width, height);
  }

}
