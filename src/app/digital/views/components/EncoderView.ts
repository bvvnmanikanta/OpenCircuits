import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, DEFAULT_FILL_COLOR, SELECTED_BORDER_COLOR, SELECTED_FILL_COLOR} from "core/utils/Constants";

import {V} from "Vector";

import {Rect} from "math/Rect";

import {DigitalPortGroup, Encoder} from "core/models/types/digital";
import {Line}                      from "core/utils/rendering/shapes/Line";
import {Rectangle}                 from "core/utils/rendering/shapes/Rectangle";
import {Style}                     from "core/utils/rendering/Style";
import {RenderInfo}                from "core/views/BaseView";
import {ComponentView}             from "core/views/ComponentView";
import {DigitalCircuitController}  from "digital/controllers/DigitalCircuitController";


export class EncoderView extends ComponentView<Encoder, DigitalCircuitController> {
    public constructor(circuit: DigitalCircuitController, obj: Encoder) {
        super(circuit, obj, V(1, 1));
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const transform = this.getTransform();
        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
        const fillCol   = (selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);
        const style = new Style(fillCol, borderCol, DEFAULT_BORDER_WIDTH);
        // Get size of model
        const size = this.transform.get().getSize();

        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === DigitalPortGroup.Input).length;

        // Draw line to visually match input ports
        const l1 = -(inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) - DEFAULT_BORDER_WIDTH/2;
        const l2 =  (inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2;

        const s = (size.x-DEFAULT_BORDER_WIDTH)/2;
        const p1 = V(-s, l1);
        const p2 = V(-s, l2);

        renderer.draw(new Rectangle(V(0,0), V(1,2)), style);
    }

    protected override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === DigitalPortGroup.Input).length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}
