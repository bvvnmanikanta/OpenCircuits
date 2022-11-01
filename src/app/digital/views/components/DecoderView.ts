import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, DEFAULT_FILL_COLOR, SELECTED_BORDER_COLOR, SELECTED_FILL_COLOR} from "core/utils/Constants";

import {V} from "Vector";

import {Rect} from "math/Rect";

import {Decoder, DigitalPortGroup} from "core/models/types/digital";
import {Line}                      from "core/utils/rendering/shapes/Line";
import {Rectangle}                 from "core/utils/rendering/shapes/Rectangle";
import {Style}                     from "core/utils/rendering/Style";
import {RenderInfo}                from "core/views/BaseView";
import {ComponentView}             from "core/views/ComponentView";

import {DigitalViewInfo} from "../DigitalViewInfo";


export class DecoderView extends ComponentView<Decoder, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: Decoder) {
      super(info, obj, V(1, 2));
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
        const fillCol   = (selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);
        const style = new Style(fillCol, borderCol, DEFAULT_BORDER_WIDTH);

        // Get current number of outputss
        const numInputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === DigitalPortGroup.Input).length;

        // Get size of model
        const size = V((1 + (numInputs - 1)/20), 1/2 * Math.pow(2, numInputs));

        renderer.draw(new Rectangle(V(), size), style)
    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === DigitalPortGroup.Input).length;
        return super.getBounds().expand(V(0, 1));
    }
}
