import { dft } from "../default";
import {
  anyObj,
  IEventMapFun,
  ILTableInitOptions,
} from "../index.d";
import { addOn } from "../utils";
import { CanvasCtx } from "./CanvasCtx";
import { TableBody } from "./TbBody";
import { TableHeader } from "./TbHeader";
import { Wrapper } from "./Wrapper";
import { ScrollBar } from "./index";

export class Table extends CanvasCtx {
  header: TableHeader;
  body: TableBody;
  scrollBar: ScrollBar;
  wrapper: Wrapper

  constructor(dom: HTMLCanvasElement, options: ILTableInitOptions) {
    super(dom, options.size);

    const { column, columnH } = options;

    const { cellH: dftH } = dft;

    let colH = columnH || dftH;

    this.header = new TableHeader(this.ctx, column, { cellH: colH });
    this.body = new TableBody(this.ctx, this.header.columnMap, { colH });
    this.wrapper = new Wrapper(this.ctx, colH)
    this.scrollBar = new ScrollBar(this.ctx, colH, () => this.afterScroll());

    //setup时 先绘制已经确定的表头
    this.header.render();
    this.setEventListener()
  }

  set data(data: anyObj[]) {
    this.body.setData(data);
    this.scrollBar.scrollHeight = data.length * this.body.cellH;
  }

  afterScroll() {
    this.body.render();
    this.header.fixPosition(this.scrollBar.scrollTop);
  }

  setEventListener() {
    const bodyWrapper = this.wrapper.bodyWrapper

    const wheelEvent = (event: WheelEvent) => {
      const { deltaY } = event
      this.scrollBar.move(0, deltaY)
    }

    const mousemoveEvent = (event: MouseEvent) => {

      const { rows, cellH } = this.body

      const { offsetY } = event;
      let { scrollTop } = this.scrollBar

      let preAct = rows.find((v) => v.active);

      let activeIndex = (offsetY + scrollTop) / cellH;

      let finIndex = parseInt(activeIndex.toString());

      if (preAct === rows[finIndex]) return;
      if (preAct) preAct.active = false;
      if (rows[finIndex].active != true)
        rows[finIndex].active = true;
    }

    addOn(bodyWrapper, [
      ['wheel', wheelEvent],
      ['mousemove', mousemoveEvent]
    ])
  }



}





