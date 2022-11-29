import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, SELECTED_BORDER_COLOR} from "core/utils/Constants";
import {SRLatch} from "core/models/types/digital";
import {ComponentView} from "core/views/ComponentView";
import {Rect} from "math/Rect";
import {Style} from "core/utils/rendering/Style";
import {Line} from "core/utils/rendering/shapes/Line";
import {V} from "Vector";
import {DigitalViewInfo} from "../DigitalViewInfo";
import {RenderInfo}    from "core/views/BaseView";
import { Rectangle } from "core/utils/rendering/shapes/Rectangle";

export class SRLatchView extends ComponentView<SRLatch, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: SRLatch) {
        super(info, obj, V(1, 1) , "base.svg");
    }

    
    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);

        const style = new Style(undefined, borderCol);

        // Get size of model
        const size = this.transform.get().getSize();

        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;

        // Draw line to visually match input ports
        const l1 = -(inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) - DEFAULT_BORDER_WIDTH/2;
        const l2 =  (inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2;

        const s = (size.x-DEFAULT_BORDER_WIDTH)/2;
        const p1 = V(-s, l1);
        const p2 = V(-s, l2);

    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}


