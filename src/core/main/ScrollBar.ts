import { getType, addClass } from "../../utils";
import "../../style.css";
import { h } from "../../utils/render";
import { dft } from "../default";

export class ScrollBar {
  rootDom: HTMLCanvasElement;
  colH: number;
  constructor(root: HTMLCanvasElement | string, colH: number) {
    let rootTarget;

    if (root instanceof HTMLCanvasElement) {
      rootTarget = root;
    } else if (getType(root) == "string") {
      rootTarget = document.querySelector(root);
    }

    if (!rootTarget) throw new Error("get canvas dom Error!");
    if (!(rootTarget instanceof HTMLCanvasElement)) throw new Error("Bind a canvas dom please！");

    this.rootDom = rootTarget;
    this.colH = colH;
    this.mount();
  }
  mount() {
    const { rootDom, colH } = this;

    let { width, height } = rootDom.style;

    const warpper = document.createElement("div");
    warpper.style.width = width;
    warpper.style.height = height;
    warpper.style.position = "relative";
    addClass(warpper, "canvas-warpper");
    rootDom.after(warpper);

    this.rootDom.remove();

    let verticalScrollWrapper = h("div");
    verticalScrollWrapper.style.height = Number(height.replace("px", "")) - dft.scrollW - colH + "px";
    verticalScrollWrapper.style.width = `${dft.scrollW}px`;
    verticalScrollWrapper.style.background = dft.scrollBg;
    verticalScrollWrapper.style.top = colH.toString() + "px";
    let inner = document.createElement("div");
    inner.style.position = "absolute";
    addClass(verticalScrollWrapper, "scrollRight", "scroll");

    let horizonScrollWrapper = h("div");
    horizonScrollWrapper.style.height = `${dft.scrollW}px`;

    horizonScrollWrapper.style.width = Number(width.replace("px", "")) - dft.scrollW + "px";
    horizonScrollWrapper.style.background = dft.scrollBg;
    addClass(horizonScrollWrapper, "scrollBottom", "scroll");

    warpper.append(rootDom);
    warpper.append(verticalScrollWrapper);
    warpper.append(horizonScrollWrapper);
  }
}
