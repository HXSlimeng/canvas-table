import { IEventMapFun } from "../index.d";
import { h, setStyle, addClass, addOn } from "../utils";

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
        //set canvas wrapper
        const container = h("div");
        setStyle(container, {
            width: canvasW + "px",
            height: canvasH + "px",
            // width: '100%',
            // height: '100%',
            position: "relative",
        });
        addClass(container, "canvas-container");

        //set body wrapper
        const bodyWrapper = h("div");
        setStyle(bodyWrapper, {
            position: "absolute",
            top: this.headerH + "px",
            width: canvasW + "px",
            height: canvasH - this.headerH + "px",
        });
        addClass(bodyWrapper, "body-wrapper");

        const canvasDom = this.ctx.canvas
        canvasDom.after(container)
        canvasDom.remove()
        container.append(canvasDom)
        container.append(bodyWrapper)

        return [container, bodyWrapper]
    }


    obSize(callback: Function) {
        const resizeOb = new ResizeObserver((entries) => {

            callback()

            const { width: canvasW, height: canvasH } = this.ctx.canvas.getBoundingClientRect()
            setStyle(this.bodyWrapper, {
                height: canvasH - this.headerH + "px",
                width: canvasW + 'px'
            })

        })
        resizeOb.observe(this.container)


        // const wheelEvent = (event: WheelEvent | MouseEvent) => {
        //     this.emit('wheel', event)
        // }
        // addOn(this.bodyWrapper, [
        //     ['wheel', this.emit()],
        //     ['mouseover',]
        // ])
    }
}