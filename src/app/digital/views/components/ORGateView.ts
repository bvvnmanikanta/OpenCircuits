import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, DEFAULT_FILL_COLOR, GATE_NOT_CIRCLE_RADIUS, SELECTED_BORDER_COLOR, SELECTED_FILL_COLOR} from "core/utils/Constants";

import {V, Vector} from "Vector";

import {Rect} from "math/Rect";

import {Style} from "core/utils/rendering/Style";

import {ORGate} from "core/models/types/digital";
import {RenderInfo}               from "core/views/BaseView";
import {ComponentView}            from "core/views/ComponentView";
import {Renderer} from "core/utils/rendering/Renderer";
import {QuadCurve} from "core/utils/rendering/shapes/QuadCurve";
import {DigitalViewInfo} from "../DigitalViewInfo";


export class ORGateView extends ComponentView<ORGate, DigitalViewInfo> {
    public constructor(circuit: DigitalViewInfo, obj: ORGate) {
        super(circuit, obj, V(1.2, 1), "or.svg");
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
        const fillCol = (selected ? SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR);

        const style = new Style(fillCol, borderCol, DEFAULT_BORDER_WIDTH);

        // // Get size of model
        const size = this.transform.get().getSize();

        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;

        //Draw curves to visually match input ports
        ORGateView.drawQuadCurve(renderer,     0, size, inputs, borderCol);
        
    }

    public static drawQuadCurve(renderer: Renderer, dx: number, size: Vector, inputs: number, borderCol: string): void {
        const style = new Style(undefined, borderCol, DEFAULT_CURVE_BORDER_WIDTH);
        const amt = 2 * Math.floor(inputs / 4) + 1;

        // Renders a specialized shorter curve for an xor and xnor gate (dx != 0) when there are 2 or 3 ports (amt == 1)
        const [lNumMod, sMod] = (amt === 1 && dx !== 0) ? ([0.014, 0]) : ([0, 0.012]);
        for (let i = 0; i < amt; i++) {
            const d = (i - Math.floor(amt / 2)) * size.y;
            const h = DEFAULT_BORDER_WIDTH;
            const l1 = -size.y / 2 + lNumMod;
            const l2 = +size.y / 2 - lNumMod;

            const s = size.x / 2 - h + sMod;
            const l = size.x / 5 - h;

            const p1 = V(-s + dx, l1 + d);
            const p2 = V(-s + dx, l2 + d);
            const c = V(-l + dx, d);
            
        }
    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}