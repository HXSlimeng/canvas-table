import { h, setStyle, addClass, on, off } from "../utils";

export class Wrapper {
    private ctx: CanvasRenderingContext2D
    private headerH: number
    container: HTMLElement
    bodyWrapper: HTMLElement

    constructor(ctx: CanvasRenderingContext2D, headerH: number) {
        this.ctx = ctx
        this.headerH = headerH

        const [container, bodyWrapper] = this.mount()
        this.container = container
        this.bodyWrapper = bodyWrapper

        // this.setUpEvent()
    }
    mount() {
        const { width: canvasW, height: canvasH } = this.ctx.canvas.getBoundingClientRect()

        //set body wrapper
        let container = this.ctx.canvas.parentElement!

        const bodyWrapper = h("div");
        setStyle(bodyWrapper, {
            position: "absolute",
            top: this.headerH + "px",
            width: canvasW + "px",
            height: canvasH - this.headerH + "px",
            pointerEvents: 'none'
            // zIndex: '-1',
        });
        addClass(bodyWrapper, "body-wrapper");

        const canvasDom = this.ctx.canvas
        canvasDom.after(canvasDom)
        canvasDom.after(bodyWrapper)

        return [container, bodyWrapper]
    }


    obSize(callback: Function) {
        const resizeOb = new ResizeObserver(() => {
            callback()

            const { width: canvasW, height: canvasH } = this.ctx.canvas.getBoundingClientRect()
            setStyle(this.bodyWrapper, {
                height: canvasH - this.headerH + "px",
                width: canvasW + 'px'
            })
        })
        resizeOb.observe(this.container)
    }
}