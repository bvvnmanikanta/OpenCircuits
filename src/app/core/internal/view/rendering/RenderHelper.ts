import {Matrix2x3} from "math/Matrix";
import {parseColor, SVGDrawing} from "svg2canvas";
import {V, Vector} from "Vector";
import {CameraView} from "../CameraView";
import {Shape} from "./shapes/Shape";
import {Style} from "./Style";


export class RenderHelper {
    protected canvas?: HTMLCanvasElement;
    protected context?: CanvasRenderingContext2D | null;

    protected camera: CameraView;

    public constructor(camera: CameraView) {
        this.camera = camera;
    }

    protected get ctx(): CanvasRenderingContext2D {
        if (!this.context)
            throw new Error(`RenderHelper: Uninitialized context! ${this.canvas} | ${this.context}`);
        return this.context;
    }

    public setCanvas(canvas?: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas?.getContext("2d");
    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }

    public transform(m: Matrix2x3) {
        this.ctx.transform(
            m.get(0), m.get(1), 
            m.get(2), m.get(3), 
            m.get(4), m.get(5),
        );
    }

    public toWorldSpace(): void {
        const inv = this.camera.matrix.inverse();
        this.transform(inv.withTranslation(inv.pos.add(this.size.scale(0.5))));
    }
    public toScreenSpace(): void {
        this.transform(this.camera.matrix);
    }

    public image(img: SVGDrawing, pos: Vector, size: Vector, tint?: string): void {
        const col = (tint ? parseColor(tint) : undefined);

        // Flip y-axis scale
        img.draw(this.ctx, pos.x, pos.y, size.x, -size.y, col);
    }

    public draw(shape: Shape, style: Style, alpha = 1): void {
        this.save();
        this.setStyle(style, alpha);

        // Begin path and draw the shape
        this.ctx.beginPath();
        shape.draw(this.ctx);

        // Only fill or stroke if we have to
        if (style.fill())
            this.ctx.fill();
        if (style.stroke())
            this.ctx.stroke();

        this.ctx.closePath();
        this.restore();
    }

    public beginPath() {
        this.ctx.beginPath();
    }
    public closePath() {
        this.ctx.closePath();
    }
    public moveTo(p: Vector) {
        this.ctx.moveTo(p.x, p.y);
    }
    public lineTo(p: Vector) {
        this.ctx.lineTo(p.x, p.y);        
    }
    public pathLine(p1: Vector, p2: Vector): void {
        this.moveTo(p1);
        this.lineTo(p2);
    }
    public stroke() {
        this.ctx.stroke();
    }

    public setStyle(style: Style, alpha = 1) {
        this.ctx.globalAlpha = alpha;

        if (style.fillColor)
            this.ctx.fillStyle = style.fillColor;
        if (style.strokeColor)
            this.ctx.strokeStyle = style.strokeColor;
        if (style.strokeSize)
            this.ctx.lineWidth = style.strokeSize;
    }

    public save(): void {
        this.ctx.save();
    }
    public restore(): void {
        this.ctx.restore();
    }

    public get size(): Vector {
        return V(this.canvas?.width ?? 0, this.canvas?.height ?? 0);
    }
}