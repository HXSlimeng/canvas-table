import { addClass, display, off, on, rtf, setStyle } from "../utils/index";
import { h } from "../utils/render";
import { dft } from "../default";

export interface IScroll {
  dom: HTMLElement;
  len: number;
  movedLen: number;
  show: boolean
  inner?: {
    dom: HTMLElement;
    len: number;
  };
}

export class ScrollBar {
  headerH: number;

  private scrollY: IScroll;
  private scrollX: IScroll;

  ctx: CanvasRenderingContext2D;
  repaint: Function;
  private info = {
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  };

  private canvasW: number;
  private canvasH: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    headerH: number,
    repaint: Function
  ) {
    const rootDom = ctx.canvas;
    this.ctx = ctx;
    this.repaint = repaint;
    this.headerH = headerH;
    const { width: canvasW, height: canvasH } =
      rootDom.getBoundingClientRect();
    this.canvasH = canvasH;
    this.canvasW = canvasW;

    const [scrollX, scrollY] = this.mount();

    this.scrollX = scrollX;
    this.scrollY = scrollY;
  }

  get bodyHeight() {
    return this.canvasH - this.headerH;
  }

  get canvasWrapper() {
    return this.ctx.canvas.parentElement;
  }

  mount() {
    const { headerH, canvasH, canvasW } = this;
    const canvasDom = this.ctx.canvas

    //vertical Scroll
    let verticalScroll = h("div");
    let verticalTotalLen = canvasH - dft.scrollW - headerH;

    setStyle(verticalScroll, {
      height: canvasH - dft.scrollW - headerH + "px",
      width: `${dft.scrollW}px`,
      background: dft.scrollBg,
      top: headerH.toString() + "px",
      visibility: 'hidden'
    });

    addClass(verticalScroll, "scrollRight", "scroll", 'hidden');
    let scrollY = {
      dom: verticalScroll,
      len: verticalTotalLen,
      movedLen: 0,
      show: false
    };

    //horizon Scroll
    let horizonScroll = h("div");
    let horizonTotalLen = canvasW - dft.scrollW;

    setStyle(horizonScroll, {
      height: `${dft.scrollW}px`,
      width: horizonTotalLen + "px",
      background: dft.scrollBg,
      visibility: 'hidden'
    });
    addClass(horizonScroll, "scrollBottom", "scroll", 'hidden');
    let scrollX = {
      dom: horizonScroll,
      len: horizonTotalLen,
      movedLen: 0,
      show: false
    };

    canvasDom.after(verticalScroll);
    canvasDom.after(horizonScroll);
    [verticalScroll, horizonScroll].forEach(dom => {

      on(dom, 'transitionend', () => {
        const opacity = getComputedStyle(dom).opacity
        if (opacity === '0') {
          dom.style.visibility = 'hidden'
        }
      })
    })

    return [scrollX, scrollY];
  }

  get showScrollY() {
    return this.scrollY.show
  }

  get showScrollX() {
    return this.scrollX.show
  }

  set scrollWidth(val: number) {
    this.info.scrollWidth = val

    let inner: HTMLElement
    let realBodyW = this.canvasW
    let innerW = realBodyW / val * (realBodyW - dft.scrollW)

    if (this.scrollX.inner) {
      inner = this.scrollX.dom
    } else {
      inner = h('div')
      addClass(inner, 'scrollX_inner')
      this.scrollX.inner = {
        dom: inner,
        len: innerW
      }
      this.scrollX.dom.appendChild(inner)
      this.addDragListener('x', inner)
    }

    setStyle(inner, {
      width: innerW + 'px',
      left: '0px',
    })

    this.scrollX.show = val > realBodyW
  }

  get scrollWidth() {
    return this.info.scrollWidth
  }


  set scrollHeight(val: number) {
    let inner: HTMLElement

    let realBodyH = this.canvasH - this.headerH;
    let innerH = (realBodyH / val) * (realBodyH - dft.scrollW);

    this.info.scrollHeight = val;

    if (this.scrollY.inner) {
      inner = this.scrollY.inner.dom
    } else {
      inner = h("div");
      addClass(inner, "scrollY_inner");
      this.scrollY.inner = {
        dom: inner,
        len: innerH,
      };
      this.scrollY.dom.appendChild(inner);
      this.addDragListener('y', inner)
    }

    setStyle(inner, {
      top: "0px",
      height: innerH + "px",
    });

    let showScrollY = val > this.bodyHeight;

    this.scrollY.show = showScrollY
    // this.showScrollY = showScrollY;

    // if (showScrollY) {

    //   let bodyWrapper = this.canvasWrapper!.querySelector(".body-wrapper");

    //   let wheelEvt = (event: WheelEvent) => {
    //     const { deltaY } = event;
    //     this.move(0, deltaY);
    //   };
    //   addOn(bodyWrapper as HTMLElement, [["wheel", wheelEvt]]);
    // }
  }

  get scrollHeight() {
    return this.info.scrollHeight;
  }

  set scrollTop(val: number) {
    this.info.scrollTop = val;

    if (this.scrollY.inner) {
      const { dom } = this.scrollY.inner;
      let inner_offsetTop =
        (val / this.scrollHeight) * this.scrollY.len;
      setStyle(dom, { top: inner_offsetTop + "px" });

      this.scrollY.movedLen = inner_offsetTop;
    }
  }

  get scrollTop() {
    return this.info.scrollTop;
  }

  set scrollLeft(val: number) {

    this.info.scrollLeft = val;

    if (this.scrollX.inner) {
      const { dom } = this.scrollX.inner
      let inner_offsetLeft = (val / this.scrollWidth) * this.scrollX.len

      setStyle(dom, { left: inner_offsetLeft + 'px' })

      this.scrollX.movedLen = inner_offsetLeft
    }

  }

  get scrollLeft() {
    return this.info.scrollLeft;
  }

  move(type: 'x' | 'y', val: number) {
    if (type === 'y') {
      let moveY = this.scrollTop + val;
      let max = this.scrollHeight - this.bodyHeight;

      if (moveY < 0) {
        val = -this.scrollTop;
        this.scrollTop = 0;
      } else if (moveY >= max) {
        val = max - this.scrollTop;
        this.scrollTop = max;
      } else {
        this.scrollTop += val;
      }

      this.ctx.translate(0, -rtf(val));
      this.repaint();
    } else {
      let moveX = this.scrollLeft + val
      let max = this.scrollWidth - this.canvasW

      if (moveX < 0) {
        val = -this.scrollLeft
        this.scrollLeft = 0
      } else if (moveX >= max) {
        val = max - this.scrollLeft
        this.scrollLeft = max
      } else {
        this.scrollLeft += val
      }
      this.ctx.translate(-rtf(val), 0)
      this.repaint()
    }
  }

  addDragListener(type: 'x' | 'y', dom: HTMLElement) {
    const moveEvent = (evt: MouseEvent) => {
      evt.preventDefault && evt.preventDefault()
      let val: number
      if (type === 'x') {
        val = evt.movementX / (this.canvasW - dft.scrollW) * this.scrollWidth
      } else {
        val = evt.movementY / (this.bodyHeight - dft.scrollW) * this.scrollHeight
      }
      this.move(type, val)
    }

    const downEvent = () => {
      addEventListener('mousemove', moveEvent)
      on(dom, 'mouseup', () => {
        off(dom, 'mousemove', moveEvent)
      })
    }

    on(dom, 'mousedown', downEvent)

    addEventListener('mouseup', () => removeEventListener('mousemove', moveEvent))
  }

  toogleScrollIfNeed(show: boolean) {

    const { scrollX, scrollY } = this

    if (show) {
      scrollX.dom.style.visibility = 'visible'
      scrollY.dom.style.visibility = 'visible'
    }

    display(scrollX.dom, show && scrollX.show)
    display(scrollY.dom, show && scrollY.show)
  }

  resetScroll() {

  }

  resize() {
    const { width: canvasW, height: canvasH } = this.ctx.canvas.getBoundingClientRect()
    this.canvasH = canvasH
    this.canvasW = canvasW

    setStyle(this.scrollY.dom, {
      height: this.bodyHeight + 'px'
    })

    let innerH = (this.bodyHeight / this.scrollHeight) * this.bodyHeight

    const { scrollTop, scrollHeight } = this
    console.log({ innerH, scrollHeight, scrollTop });

    let inner_offsetTop = (this.scrollTop / this.scrollHeight) * innerH
    this.scrollY.inner!.len = innerH
    this.scrollY.movedLen = inner_offsetTop

    setStyle(this.scrollY.inner!.dom, {
      height: innerH + 'px',
      top: inner_offsetTop + 'px'
    })

  }
}
