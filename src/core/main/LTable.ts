import { dft } from "../default";
import {
  anyObj,
  ILTableInitOptions,
} from "../table";
import { addOn, dertf, rtf } from "../utils";
import { CanvasCtx } from "./CanvasCtx";
import { TableBody } from "./TbBody";
import { TableHeader } from "./TbHeader";
import { Wrapper } from "./Wrapper";
import { Cell, ScrollBar } from "./index";

export class Table extends CanvasCtx {
  header: TableHeader;
  body: TableBody;
  scrollBar: ScrollBar;
  wrapper: Wrapper;
  preActiveCell: Cell | null = null

  constructor(dom: HTMLElement, options: ILTableInitOptions) {
    super(dom);

    const { columns, columnH, selectable } = options;

    const { cellH: dftH } = dft;

    let colH = columnH || dftH;

    this.header = new TableHeader(this.ctx, { columns, cellH: colH, selectable });
    this.body = new TableBody(this.ctx, this.header.columnMap, { colH });
    this.wrapper = new Wrapper(this.ctx, colH)
    this.scrollBar = new ScrollBar(this.ctx, colH, () => this.afterScroll());
    this.scrollBar.scrollWidth = this.header.width

    //setup时 先绘制已经确定的表头
    this.header.render();

    this.wrapper.obSize(() => {
      this.setCanvasSize()
      this.scrollBar.resize()
      this.body.render()
      this.header.fixPosition(this.scrollBar.scrollTop)
    })

    this.setEventListener()
    // this.autoScroll()
  }

  set data(data: anyObj[]) {
    this.scrollBar.scrollLeft = 0
    this.scrollBar.scrollTop = 0
    this.ctx.resetTransform()
    this.body.setData(data);
    this.scrollBar.scrollHeight = data.length * this.body.cellH;
  }

  getSelectedInfo() {
    return this.header.selectedRows.map(row => row.rowInfo)
  }

  afterScroll() {
    this.body.render();
    this.header.fixPosition(this.scrollBar.scrollTop);
  }

  autoScroll() {
    window.requestAnimationFrame(() => {
      this.scrollBar.move('x', 1)
      this.autoScroll()
    })
  }

  setEventListener() {
    const bodyWrapper = this.wrapper.container
    const scrollBar = this.scrollBar
    let scrollAct = scrollBar.scrollAct

    const wheelEvent = (event: WheelEvent) => {
      event.preventDefault()
      const { deltaY } = event
      this.scrollBar.move('y', deltaY)
      scrollAct()
    }

    const mousemoveEvent = (event: MouseEvent) => {
      //行悬浮  active状态
      const { rows, cellH } = this.body

      const { offsetY, offsetX } = event;

      let { scrollTop } = this.scrollBar
      let preAct = rows.find((v) => v.active);

      let activeRow

      if (offsetY < this.header.height) {
        activeRow = this.header.row
      } else {
        let finIndex = parseInt(((offsetY + scrollTop) / cellH).toString()) - 1;
        activeRow = rows[finIndex]
      }

      if (preAct !== activeRow) {
        if (preAct) preAct.active = false;
        if (!activeRow.active)
          activeRow.active = true;
        //重新绘制表头  防止 后绘制的row 覆盖
        this.header.render()
      };

      //锁定悬浮cell
      let activeCell = activeRow.cells.find(cell => {
        const { startX, width } = cell.drawParams
        return offsetX <= dertf(startX) + dertf(width) && offsetX > dertf(startX)
      })

      if (activeCell) {
        if (this.preActiveCell?.tag !== activeCell.tag) {
          this.preActiveCell && (this.preActiveCell.hovering = false)
          this.preActiveCell = activeCell
          this.preActiveCell.eventInfo = null
          activeCell.hovering = true
        }
        //update event Info 
        activeCell.eventInfo = {
          point: { offsetX, offsetY: offsetY + scrollTop },
          currentRow: activeRow,
          dataRows: this.body.rows
        }
      }
      scrollAct()
    }

    addOn(bodyWrapper, [
      ['wheel', wheelEvent],
      ['mousemove', mousemoveEvent],
    ])
  }

}





