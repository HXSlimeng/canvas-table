type GetVals<T> = {
  [key in keyof T]: T[key];
};
type IRender = <K extends keyof HTMLElementTagNameMap>(tag: K, options?: object) => HTMLElementTagNameMap[K];

export const h = (tag: keyof HTMLElementTagNameMap) => {
  return document.createElement(tag);
};

export const append = document.insertBefore;
