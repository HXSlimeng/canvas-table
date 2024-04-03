import { ICellContent, ICellParams, ICellStyle, IRenderContent, anyObj } from "../table";
import { dft } from "./../default";
import { RATIO, addClass, dertf, getType, h, isPointInRectRange, rtf, setStyle } from "../utils/index";
import { restoreCtx } from "../descriptor";
import { Row } from "./Row";

type cellInfo = [string, number | string | boolean]


export class Cell {
  defaultStyle: ICellStyle
  active = false;
  fitText: string | null = null
  messageTimer: NodeJS.Timeout | null = null
  textEllipsis: boolean = false
  messageDom: HTMLElement | null = null
  mouseOver = false
  eventInfo: {
    point: {
      offsetX: number,
      offsetY: number,
      scrollTop: number,
      scrollLeft: number
    },
    currentRow: Row,
    dataRows: Row[]
  } | null = null
  contentRender?: IRenderContent[]

  constructor(
    public ctx: CanvasRenderingContext2D,
    public rectParams: ICellParams,
    public cellInfo: [string, number | string | boolean],
    cellStyle?: ICellStyle,
    contentRender?: IRenderContent[] | IRenderContent
  ) {
    this.defaultStyle = cellStyle || { fontColor: dft.fontColor, bgColor: dft.bgColor };

    //处理事件绑定的callback
    let wrapedRender = (item: IRenderContent) => {
      let { width: cellW, height: cellH } = this.drawParams
      return {
        ...item,
        event: item.event?.map(([key, callback, notInrangeCb]) => {
          let managedCb = () => {
            let { currentRow, point, dataRows } = this.eventInfo!
            const { width, height } = item.size

            let ctxW: number = width
            let ctxH: number = height

            let imgStartX = this.drawParams.startX + cellW / 2 - ctxW / 2
            let imgStartY = this.drawParams.startY + cellH / 2 - ctxH / 2

            let startX = point.offsetX + point.scrollLeft
            let startY = point.offsetY + point.scrollTop

            if (isPointInRectRange([rtf(startX), rtf(startY)], [imgStartX, imgStartY, width, height])) {
              callback(currentRow, dataRows)
            } else {
              notInrangeCb && notInrangeCb()
            }
          }

          return [key, managedCb, notInrangeCb]
        })
      }
    }

    if (contentRender) {
      if (Array.isArray(contentRender)) {
        //@ts-ignore
        this.contentRender = contentRender?.map(wrapedRender)
      } else {
        //@ts-ignore
        this.contentRender = [wrapedRender(contentRender)]
      }
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
    return this.active ? {
      bgColor: dft.actBgColor,
      fontColor: dft.actFtColor,
      ...this.defaultStyle
    } : this.defaultStyle;
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
    this.showMessageIfneed()
    val ? this.eventOn() : this.eventOff()
    if (!val && this.messageTimer) {
      clearTimeout(this.messageTimer)
      if (this.messageDom) {
        this.messageDom.remove()
      }
    };
  }

  get hovering() {
    return this.mouseOver
  }

  getFitText(text: string) {
    const { ctx, drawParams: { width }, fitText } = this
    if (fitText) return fitText

    let textW = rtf(ctx.measureText(text).width)
    let maxW = dertf(width) - 20

    if (textW <= maxW) {
      this.fitText = text
      this.textEllipsis = false
      return text
    } else {
      let len = 0
      let i = 0
      let str = ''
      let ellipsis = '...'
      do {
        i++
        str = text.slice(0, i)
        len = rtf(ctx.measureText(str + ellipsis).width)
      } while (len <= maxW);

      this.fitText = str + ellipsis
      this.textEllipsis = true
      return str + ellipsis
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
      this.contentRender.forEach(({ renderFun, size, click }) => {
        this.drawItem(renderFun(this.value, iY), click, size)
      })
    } else if (Array.isArray(content)) {
      content.forEach(item => this.drawItem(item))
    } else {
      this.drawItem(content)
    }
    // ctx.fillText(fitText, startX, startY);
  }

  @restoreCtx
  drawItem(content: ICellContent | ICellContent[], click?: boolean, size?: { width: number, height: number }) {
    const { ctx } = this
    const { startX, startY, width: cellW, height: cellH } = this.drawParams

    if (getType(content) === 'string') {
      const { fontColor, font } = this.cellStyle
      const fitText = this.getFitText(content as string)

      ctx.font = `${font || ''} ${RATIO}rem sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = click ? '#409eff' : fontColor || dft.fontColor;
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

  private renderMessageTooltip(content: string) {
    try {
      let container = this.ctx.canvas.parentElement!
      if (!this.messageDom) {
        const { point } = this.eventInfo!
        let tooltip = h('div')
        tooltip.innerText = content
        addClass(tooltip, 'tooltipText')
        setStyle(tooltip, {
          top: point.offsetY + 'px',
          left: point.offsetX + 'px',
        })
        this.messageDom = tooltip
      }
      container.appendChild(this.messageDom)
    } catch (error) {
      console.log(error);

    }
  }
  showMessageIfneed() {
    if (!this.textEllipsis) return;
    let { content, iY } = this.rectParams
    if (this.contentRender) {
      content = this.contentRender[0].renderFun(this.value, iY)
    }
    if (typeof content === 'string') {

      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
      }
      this.messageTimer = setTimeout(() => {
        this.renderMessageTooltip(content as string)
      }, 500)
    }
  }
}
