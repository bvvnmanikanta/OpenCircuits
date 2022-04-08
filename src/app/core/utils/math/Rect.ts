import {V, Vector} from "Vector";


export type Margin = {
    left?: number;
    right?: number;
    bottom?: number;
    top?: number;
}
export function Margin(left: number, right: number, bottom: number, top: number): Margin;
export function Margin(h: number, v: number): Margin;
export function Margin(left: number, right: number, bottom?: number, top?: number) {
    if (bottom !== undefined) {
        return { left, right, bottom, top };
    } else {
        const h = left, v = right;
        return { left: h, right: h, bottom: v, top: v };
    }
}


export class Rect {
    public center: Vector;
    public size: Vector;

    private yIsUp: number; // +1 or -1

    public constructor(center: Vector, size: Vector, yIsUp = true) {
        this.center = V(center);
        this.size = V(size);
        this.yIsUp = (yIsUp ? +1 : -1);
    }

    // Utility methods to update x/y and width/height at same time since in calculation
    //  this.left/right/top/bottom depend on current size/center so have to set both at once
    private updateX(newX: number, newW: number) {
        this.x = newX;
        this.width = newW;
    }
    private updateY(newY: number, newH: number) {
        this.y = newY;
        this.height = newH;
    }

    public intersects(rect: Rect): boolean {
        return (rect.right  >= this.left  &&
                rect.left   <= this.right &&
                rect.top    <= this.top   &&
                rect.bottom >= this.bottom);
    }

    public contains(pt: Vector): boolean {
        return (pt.x <= this.right &&
                pt.x >= this.left  &&
                pt.y <= this.top   &&
                pt.y >= this.bottom);
    }

    public subMargin(margin: Margin) {
        const result = new Rect(this.center, this.size, (this.yIsUp === +1));
        result.left   += (margin.left  ?? 0);
        result.right  -= (margin.right ?? 0);
        result.bottom += this.yIsUp * (margin.bottom ?? 0);
        result.top    -= this.yIsUp * (margin.top    ?? 0);
        return result;
    }
    public sub(rect: Rect): Rect[] {
        if (!this.intersects(rect))
            return [];

        return [
            Rect.from({ left: this.left,  right: rect.left,  top: this.top,    bottom: rect.top }),
            Rect.from({ left: this.left,  right: rect.left,  top: rect.top,    bottom: rect.bottom }),
            Rect.from({ left: this.left,  right: rect.left,  top: rect.bottom, bottom: this.bottom }),
            Rect.from({ left: rect.left,  right: rect.right, top: this.top,    bottom: rect.top }),
            Rect.from({ left: rect.left,  right: rect.right, top: rect.bottom, bottom: this.bottom }),
            Rect.from({ left: rect.right, right: this.right, top: this.top,    bottom: rect.top }),
            Rect.from({ left: rect.right, right: this.right, top: rect.top,    bottom: rect.bottom }),
            Rect.from({ left: rect.right, right: this.right, top: rect.bottom, bottom: this.bottom }),
        ].filter(r => r.width > 0 && r.height > 0);
    }

    // Shifts sides given by amt
    //  if dir.x < 0, shifts amt.x left
    //  if dir.x > 0, shifts amt.x right
    //  if dir.y < 0, shifts amt.y down
    //  if dir.y > 0, shifts amt.y up
    public shift(dir: Vector, amt: Vector): Rect {
        return Rect.from({
            left:   this.left   + (dir.x < 0 ? amt.x*dir.x : 0),
            right:  this.right  + (dir.x > 0 ? amt.x*dir.x : 0),
            top:    this.top    + (dir.y > 0 ? amt.y*dir.y : 0),
            bottom: this.bottom + (dir.y < 0 ? amt.y*dir.y : 0),
        });
    }

    public set left(left: number) {
        this.updateX(
            this.center.x + (left - this.left)/2,
            this.right - left,
        );
    }
    public set right(right: number) {
        this.updateX(
            this.center.x + (right - this.right)/2,
            right - this.left,
        );
    }
    public set bottom(bottom: number) {
        this.updateY(
            this.center.y + (bottom - this.bottom)/2,
            this.yIsUp * (this.top - bottom),
        );
    }
    public set top(top: number) {
        this.updateY(
            this.center.y + (top - this.top)/2,
            this.yIsUp * (top - this.bottom)
        );
    }

    public get left() {
        return this.center.x - this.size.x/2;
    }
    public get right() {
        return this.center.x + this.size.x/2;
    }
    public get top() {
        return this.center.y + this.yIsUp*this.size.y/2;
    }
    public get bottom() {
        return this.center.y - this.yIsUp*this.size.y/2;
    }

    public set topLeft(tL: Vector) {
        this.left = tL.x;
        this.top = tL.y;
    }
    public set topRight(tR: Vector) {
        this.right = tR.x;
        this.top = tR.y;
    }
    public set bottomLeft(bL: Vector) {
        this.left = bL.x;
        this.bottom = bL.y;
    }
    public set bottomRight(bR: Vector) {
        this.right = bR.x;
        this.bottom = bR.y;
    }

    public get topLeft() {
        return V(this.left, this.top);
    }
    public get topRight() {
        return V(this.right, this.top);
    }
    public get bottomLeft() {
        return V(this.left, this.bottom);
    }
    public get bottomRight() {
        return V(this.right, this.bottom);
    }

    public set x(x: number) {
        this.center.x = x;
    }
    public set y(y: number) {
        this.center.y = y;
    }

    public get x() {
        return this.center.x;
    }
    public get y() {
        return this.center.y;
    }

    public set width(width: number) {
        this.size.x = width;
    }
    public set height(height: number) {
        this.size.y = height;
    }

    public get width() {
        return this.size.x;
    }
    public get height() {
        return this.size.y;
    }

    public static from(bounds: Required<Margin>, yIsUp = true): Rect {
        return new Rect(
            V(bounds.right + bounds.left, bounds.top + bounds.bottom).scale(V(0.5, (yIsUp ? 0.5 : -0.5))),
            V(bounds.right - bounds.left, bounds.top - bounds.bottom),
            yIsUp
        );
    }
}
