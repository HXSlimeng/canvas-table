export function restoreCtx(target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    let method = descriptor.value
    descriptor.value = function (this: { ctx: CanvasRenderingContext2D }, ...args: any) {
        this.ctx.save()
        let result = method.apply(this, args)
        this.ctx.restore()
        return result
    }
}