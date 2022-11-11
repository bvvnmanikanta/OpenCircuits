import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_FILL_COLOR, GATE_NOT_CIRCLE_RADIUS, SELECTED_BORDER_COLOR, SELECTED_FILL_COLOR} from "core/utils/Constants";

import {V} from "Vector";

import {Style} from "core/utils/rendering/Style";

import {Circle} from "core/utils/rendering/shapes/Circle";

import {AnyPort} from "core/models/types";

import {DigitalPort} from "core/models/types/digital";

import {RenderInfo} from "core/views/BaseView";
import {PortView}   from "core/views/PortView";

import {DigitalViewInfo} from "./DigitalViewInfo";


export class DigitalPortView extends PortView<DigitalPort, DigitalViewInfo> {
    public override isWireable(): boolean {
        // Output ports always can have new connections
        if (this.obj.group === "outputs") // TODOnow: fix
            return true;
        // Input and select ports can only have new connections if they don't already have any
        const wires = this.circuit.getWiresFor(this.obj);
        return (wires.length === 0);
    }

    public override isWireableWith(p: AnyPort): boolean {
        return (
            // We can wire it with `p` if we are an output port and they are an input/select port
            //  or we are an input/select port and they are an output port
            (this.obj.group === "outputs" && (p.group !== "outputs")) ||  // TODOnow: fix
            (this.obj.group !== "outputs" && (p.group === "outputs"))     // TODOnow: fix
        );
    }

    // We need to override the renderInternal in PortView so that the not circle is drawn on top
    // of the port rather than underneath it (happens if the not circle is drawn at the same time
    // as the component)
    protected override renderInternal(info: RenderInfo): void {
        super.renderInternal(info);
        const renderer = info.renderer;
        const selections = info.selections;

        const parentSelected = selections.has(this.obj.parent);
        const selected = selections.has(this.obj.id);

        const { origin } = this.pos.get();

        const borderCol     = (parentSelected ||  selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
        const circleFillCol = (parentSelected ||  selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);

        // This is necessary to make sure that the not circle is being drawn for NOT Gates only
        const parent = this.circuit.getPortParent(this.obj);

        if (parent.kind === "XNORGate" && this.obj.group === "outputs"){
            const l = origin.x + GATE_NOT_CIRCLE_RADIUS;
            const notCircleStyle = new Style(circleFillCol, borderCol, DEFAULT_BORDER_WIDTH);
            renderer.draw(new Circle(V(l, origin.y), GATE_NOT_CIRCLE_RADIUS), notCircleStyle);
        }
    }
}
