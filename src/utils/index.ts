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


export function addOn<K extends keyof HTMLElementEventMap>(target: HTMLElement, events: [K, (event: HTMLElementEventMap[K]) => any][]) {
  for (const [type, callback] of events) {
    target.addEventListener(type, callback)
  }
}

export function rtf(params: number) {
  return params * RATIO;
}

export function dertf(params: number) {
  return params / RATIO
}

