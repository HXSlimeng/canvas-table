import { addClass, addOn, setStyle } from "../../utils/index";
import "../../style.css";
import { h } from "../../utils/render";
import { dft } from "../default";

export interface IScroll {
  dom: HTMLElement;
  len: number;
  movedLen: number;
  inner?: {
    dom: HTMLElement;
    len: number;
  };
}

export class ScrollBar {
  rootDom: HTMLCanvasElement;
  headerH: number;

  private scrollY: IScroll;
  private scrollX: IScroll;

  ctx: CanvasRenderingContext2D;
  bodyRepaint: Function;
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
    bodyRepaint: Function
  ) {
    this.rootDom = ctx.canvas;
    this.ctx = ctx;
    this.bodyRepaint = bodyRepaint;
    this.headerH = headerH;
    const { width: canvasW, height: canvasH } =
      this.rootDom.getBoundingClientRect();
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
    return this.rootDom.parentElement;
  }
  mount() {
    const { rootDom, headerH, canvasH, canvasW } = this;

    //set canvas wrapper
    const warpper = h("div");
    setStyle(warpper, {
      width: canvasW + "px",
      height: canvasH + "px",
      position: "relative",
    });
    addClass(warpper, "canvas-warpper");

    //set body wrapper
    const bodyWrapper = h("div");
    setStyle(bodyWrapper, {
      position: "absolute",
      top: headerH + "px",
      width: canvasW + "px",
      height: canvasH - headerH + "px",
    });
    addClass(bodyWrapper, "body-wrapper");

    //vertical Scroll
    let verticalScroll = h("div");
    let verticalTotalLen = canvasH - dft.scrollW - headerH;
    setStyle(verticalScroll, {
      height: canvasH - dft.scrollW - headerH + "px",
      width: `${dft.scrollW}px`,
      background: dft.scrollBg,
      top: headerH.toString() + "px",
    });
    addClass(verticalScroll, "scrollRight", "scroll");
    let scrollY = {
      dom: verticalScroll,
      len: verticalTotalLen,
      movedLen: 0,
    };

    //horizon Scroll
    let horizonScroll = h("div");
    let horizonTotalLen = canvasW - dft.scrollW;
    setStyle(horizonScroll, {
      height: `${dft.scrollW}px`,
      width: horizonTotalLen + "px",
      background: dft.scrollBg,
    });
    addClass(horizonScroll, "scrollBottom", "scroll");
    let scrollX = {
      dom: horizonScroll,
      len: horizonTotalLen,
      movedLen: 0,
    };

    rootDom.after(warpper);
    this.rootDom.remove();
    warpper.append(rootDom);
    warpper.append(verticalScroll);
    warpper.append(horizonScroll);
    warpper.append(bodyWrapper);
    return [scrollX, scrollY];
  }
  set showScrollY(val: boolean) {
    let action = val ? "remove" : "add";
    //@ts-ignore
    this.scrollY.dom.classList[action]("hidden");
  }
  set showScrollX(val: boolean) {
    let action = val ? "add" : "remove";
    //@ts-ignore`
    this.scrollY.dom.classList[action]("hidden");
  }
  set scrollWidth(val: number) {}
  set scrollHeight(val: number) {
    this.info.scrollHeight = val;
    let inner = document.createElement("div");

    let realBodyH = this.canvasH - this.headerH;
    let innerH = (realBodyH / val) * realBodyH;

    setStyle(inner, {
      top: "0px",
      height: innerH + "px",
      position: "absolute",
    });
    addClass(inner, "scrollY_inner");

    this.scrollY.inner = {
      dom: inner,
      len: innerH,
    };

    // this.scrollY_inner = inner;
    // this.scrollY_dom.appendChild(inner);
    this.scrollY.dom.appendChild(inner);

    let showScrollY = val > this.bodyHeight;

    this.showScrollY = showScrollY;

    if (showScrollY) {
      let bodyWrapper = this.canvasWrapper!.querySelector(".body-wrapper");

      let wheelEvt = (event: WheelEvent) => {
        const { deltaY } = event;
        this.move(0, deltaY);
      };
      addOn(bodyWrapper as HTMLElement, [["wheel", wheelEvt]]);
    }
  }
  get scrollHeight() {
    return this.info.scrollHeight;
  }

  set scrollTop(val: number) {
    this.info.scrollTop = val;

    if (this.scrollY.inner) {
      const { dom, len: innerLen } = this.scrollY.inner;
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
  }

  get scrollLeft() {
    return this.info.scrollLeft;
  }

  move(x: number, y: number) {
    let moveY = this.scrollTop + y;
    let max = this.scrollHeight - this.bodyHeight;

    if (moveY < 0) {
      y = -this.scrollTop;
      this.scrollTop = 0;
    } else if (moveY >= max) {
      y = max - this.scrollTop;
      this.scrollTop = max;
    } else {
      this.scrollTop += y;
    }

    this.ctx.translate(x, -y);
    this.bodyRepaint();
  }
}
