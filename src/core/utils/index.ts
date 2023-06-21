export * from "./render";

export const PIXEL_RATIO = (() => {
  const ctx = document.createElement("canvas").getContext("2d") as any,
    dpr = window.devicePixelRatio || 1,
    bsr = ctx["webkitBackingStorePixelRatio"] || ctx["mozBackingStorePixelRatio"] || ctx["msBackingStorePixelRatio"] || ctx["oBackingStorePixelRatio"] || ctx["backingStorePixelRatio"] || 1;
  const ratio = dpr / bsr;
  return ratio < 1 ? 1 : ratio;
})();

export const RATIO = devicePixelRatio;

export function getType(target: unknown) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function addClass(target: HTMLElement, ...classes: string[]) {
  classes.forEach((s) => target.classList.add(s));
}

type IStyleObj = {
  [key in keyof ElementCSSInlineStyle["style"]]?: string;
};

export function setStyle(target: HTMLElement, styleOpt: IStyleObj) {
  //@ts-ignore
  Object.entries(styleOpt).forEach(([key, val]) => (target.style[key] = val));
}

type IEventItem = {
  [key in keyof HTMLElementEventMap]: [key, (event: HTMLElementEventMap[key]) => void]
}[keyof HTMLElementEventMap]

export function addOn(target: HTMLElement, events: IEventItem[]) {
  for (const [type, callback] of events) {
    target.addEventListener(type, <any>callback)
  }
}
export function removeOn(target: HTMLElement, events: IEventItem[]) {
  for (const [type, callback] of events) {
    target.removeEventListener(type, <any>callback)
  }
}

export function on<K extends keyof HTMLElementEventMap>(target: HTMLElement, key: K, callback: (event: HTMLElementEventMap[K]) => void) {
  target.addEventListener(key, callback)
}
export function off<K extends keyof HTMLElementEventMap>(target: HTMLElement, key: K, callback: (event: HTMLElementEventMap[K]) => void) {
  target.removeEventListener(key, callback)
}

export function rtf(params: number) {
  return params * RATIO;
}

export function dertf(params: number) {
  return params / RATIO
}

export function display(dom: HTMLElement, show: boolean) {
  let action: 'remove' | 'add' = show ? 'remove' : 'add'
  dom.classList[action]('hidden')
}

export function isPointInRectRange(point: [number, number], rangeRect: [number, number, number, number]) {
  const [x, y] = point
  const [startX, startY, width, height] = rangeRect

  let xInRange = startX < x && startX + width > x
  let yInRange = startY < y && startY + height > y
  return yInRange && xInRange

}

