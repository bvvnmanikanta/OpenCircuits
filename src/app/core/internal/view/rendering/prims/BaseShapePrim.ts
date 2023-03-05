import {Vector} from "Vector";

import {Prim}   from "../../Prim";
import {Style}  from "../Style";
import {Schema} from "core/schema";


export abstract class BaseShapePrim implements Prim {
    protected style: Style;

    protected constructor(style: Style) {
        this.style = style;
    }

    public cull(camera: Schema.Camera): boolean {
        throw new Error("Method not implemented.");
    }
    public hitTest(pt: Vector): boolean {
        throw new Error("Method not implemented.");
    }

    protected abstract renderShape(ctx: CanvasRenderingContext2D): void;

    protected prePath(ctx: CanvasRenderingContext2D): void {}

    public render(ctx: CanvasRenderingContext2D): void {
        // Set style
        if (this.style.fillColor !== undefined)
            ctx.fillStyle = this.style.fillColor;
        if (this.style.strokeColor !== undefined)
            ctx.strokeStyle = this.style.strokeColor;
        if (this.style.strokeSize !== undefined)
            ctx.lineWidth = this.style.strokeSize;

        ctx.save();

        this.prePath(ctx);

        ctx.beginPath();

        this.renderShape(ctx);

        if (this.style.fill())
            ctx.fill();
        if (this.style.stroke())
            ctx.stroke();

        ctx.closePath();

        ctx.restore();
    }

    public updateStyle(style: Style): void {
        this.style = style;
    }
}
