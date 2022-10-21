import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, SELECTED_BORDER_COLOR} from "core/utils/Constants";

import {V} from "Vector";

import {Rect} from "math/Rect";

import {Style} from "core/utils/rendering/Style";

import { Rectangle } from "core/utils/rendering/shapes/Rectangle";

import {ANDGate, Decoder, DigitalPortGroup, Encoder} from "core/models/types/digital";

import {RenderInfo}               from "core/views/BaseView";
import {ComponentView}            from "core/views/ComponentView";
import {DigitalCircuitController} from "digital/controllers/DigitalCircuitController";
import { DEFAULT_MAX_VERSION } from "tls";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import { DigitalViewInfo } from "../DigitalViewInfo";



export class DecoderView extends ComponentView<Decoder, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: Decoder) {
        super(info, obj, V(1, 2));
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);

        const style = new Style("WHITE", borderCol, DEFAULT_BORDER_WIDTH);

        // Get current number of outputs
         const input = this.circuit.getPortsFor(this.obj)
             .filter((p) => p.group === DigitalPortGroup.Input).length;
         const size = V((1 + (input - 1)/20), 1/2 * Math.pow(2,input));

        renderer.draw(new Rectangle(V(), size), style)
    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === DigitalPortGroup.Input).length;
        return super.getBounds().expand(V(0, 1));
    }
}
