import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, SELECTED_BORDER_COLOR} from "core/utils/Constants";

import {V} from "Vector";

import {Style} from "core/utils/rendering/Style";

import {Line} from "core/utils/rendering/shapes/Line";

import {BUFGate} from "core/models/types/digital";

import {RenderInfo}    from "core/views/BaseView";
import {ComponentView} from "core/views/ComponentView";

import {DigitalViewInfo} from "../DigitalViewInfo";


export class BUFGateView extends ComponentView<BUFGate, DigitalViewInfo> {
    public constructor(circuit: DigitalViewInfo, obj: BUFGate) {
        super(circuit, obj, V(1, 1), "buf.svg");
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);

        const style = new Style(undefined, borderCol, DEFAULT_CURVE_BORDER_WIDTH);

        const p1 = V();
        const p2 = V(this.getBounds().right, 0);

        renderer.draw(new Line(p1, p2), style);
    }
}