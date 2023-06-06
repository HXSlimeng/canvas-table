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
