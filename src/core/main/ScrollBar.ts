import { addClass, display, off, on, rtf, setStyle } from "../utils/index";
import { h } from "../utils/render";
import { dft } from "../default";

export interface IScroll {
  dom: HTMLElement;
  len: number;
  movedLen: number;
  show: boolean
  inner: {
    dom: HTMLElement;
    len: number;
  };
}

export class ScrollBar {
  private scrollY: IScroll;
  private scrollX: IScroll;
  private info = {
    scrollTop: 0,
    scrollLeft: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  };
  scrollAct: Function
  container: HTMLElement

  private canvasW: number;
  private canvasH: number;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public headerH: number,
    public repaint: Function
  ) {
    const rootDom = ctx.canvas;
    this.container = this.ctx.canvas.parentElement!.querySelector('.body-wrapper')!

    const { width: canvasW, height: canvasH } =
      rootDom.getBoundingClientRect();
    this.canvasH = canvasH;
    this.canvasW = canvasW;

    const [scrollX, scrollY] = this.mount();

    this.scrollX = scrollX;
    this.scrollY = scrollY;

    this.scrollAct = this.timerShowScroll()
  }

  get bodyHeight() {
    return this.canvasH - this.headerH;
  }

  get canvasWrapper() {
    return this.ctx.canvas.parentElement;
  }

  mount() {
    const canvasDom = this.ctx.canvas

    let verticalScroll = h("div");
    let horizonScroll = h("div");
    let scrollY, scrollX

    //vertical Scroll
    {
      let inner = h("div");
      addClass(inner, "scrollY_inner");
      verticalScroll.appendChild(inner);
      this.addDragListener('y', inner)

      setStyle(verticalScroll, {
        width: `${dft.scrollW}px`,
        background: dft.scrollBg,
        visibility: 'hidden',
        // top: this.headerH + 'px',
      });

      addClass(verticalScroll, "scrollRight", "scroll", 'hidden');
      scrollY = {
        dom: verticalScroll,
        len: 0,
        movedLen: 0,
        show: false,
        inner: {
          dom: inner,
          len: 0
        }
      };

    }
    //horizon Scroll
    {
      let inner = h('div')
      addClass(inner, 'scrollX_inner')

      horizonScroll.appendChild(inner)
      this.addDragListener('x', inner)

      setStyle(horizonScroll, {
        height: `${dft.scrollW}px`,
        background: dft.scrollBg,
        visibility: 'hidden',
        left: `0px`
      });
      addClass(horizonScroll, "scrollBottom", "scroll", 'hidden');
      scrollX = {
        dom: horizonScroll,
        len: 0,
        movedLen: 0,
        show: false,
        inner: {
          dom: inner,
          len: 0
        }
      };
    }

    this.container.append(verticalScroll, horizonScroll);
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
    this.drawScroll('x')
  }

  get scrollWidth() {
    return this.info.scrollWidth
  }

  set scrollHeight(val: number) {
    this.info.scrollHeight = val;
    this.drawScroll('y')
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
  //重新绘制滚动条
  drawScroll(type: 'x' | 'y') {
    const { scrollHeight, scrollWidth } = this
    if (type === 'y') {
      const scroll = this.scrollY
      const inner = scroll.inner
      const total = this.scrollHeight
      let realBodyH = this.bodyHeight;

      let scrollLen = realBodyH - dft.scrollW
      let innerH = (realBodyH / total) * scrollLen;

      inner.len = innerH
      this.scrollY.len = scrollLen

      setStyle(inner.dom, {
        height: innerH + "px",
      });
      setStyle(scroll.dom, {
        height: scrollLen + 'px'
      })
      scroll.show = scrollHeight > realBodyH

    } else {
      const scroll = this.scrollX
      const inner = scroll.inner
      const total = this.scrollWidth
      let realBodyW = this.canvasW;

      let scrollLen = realBodyW - dft.scrollW
      let innerW = (realBodyW / total) * scrollLen;

      inner.len = innerW
      this.scrollX.len = scrollLen

      setStyle(inner.dom, {
        width: innerW + "px",
      });
      setStyle(scroll.dom, {
        width: scrollLen + 'px'
      })
      scroll.show = scrollWidth > realBodyW
    }
  }

  move(type: 'x' | 'y', val: number) {
    this.scrollAct()
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

  private toogleScrollIfNeed(show: boolean) {

    const { scrollX, scrollY } = this

    if (show) {
      scrollX.dom.style.visibility = 'visible'
      scrollY.dom.style.visibility = 'visible'
    }

    display(scrollX.dom, show && scrollX.show)
    display(scrollY.dom, show && scrollY.show)
  }

  resize() {
    const { width: canvasW, height: canvasH } = this.ctx.canvas.getBoundingClientRect()
    this.canvasH = canvasH
    this.canvasW = canvasW
    this.resetScroll()
    this.drawScroll('x')
    this.drawScroll('y')
  }
  private resetScroll() {
    let overflowW = this.scrollWidth - this.scrollLeft - this.canvasW
    let overflowH = this.scrollHeight - this.scrollTop - this.canvasH
    if (overflowW < 0) { this.move("x", -overflowW); } else { this.scrollLeft = this.scrollLeft; };//为了触发set方法以更新滚动条
    if (overflowH < 0) { this.move("y", -overflowH); } else { this.scrollTop = this.scrollTop; };//同理
  }
  private timerShowScroll() {
    let timer: null | NodeJS.Timer = null
    let scrollBar = this
    return function () {
      if (timer) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          scrollBar.toogleScrollIfNeed(false)
          timer = null
        }, 3000);
      } else {
        scrollBar.toogleScrollIfNeed(true)
        timer = setTimeout(() => {
          scrollBar.toogleScrollIfNeed(false)
          timer = null
        }, 3000);
      }
    }
  }
}
