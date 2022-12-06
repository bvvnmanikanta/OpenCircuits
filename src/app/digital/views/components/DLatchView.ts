import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, SELECTED_BORDER_COLOR} from "core/utils/Constants";
import {Transform} from "math/Transform";
import {Renderer} from "core/utils/rendering/Renderer";
import {Rect} from "math/Rect";
import {V} from "Vector";
import {Style} from "core/utils/rendering/Style";
import {Line} from "core/utils/rendering/shapes/Line";
import {DLatch} from "core/models/types/digital";
import {RenderInfo}    from "core/views/BaseView";
import {ComponentView} from "core/views/ComponentView";
import {DigitalViewInfo} from "../DigitalViewInfo";
import { Rectangle } from "core/utils/rendering/shapes/Rectangle";


export class DLatchView extends ComponentView<DLatch, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: DLatch) {
        super(info, obj, V(1, 1), "base.svg");
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);

        const style = new Style(undefined, borderCol, DEFAULT_CURVE_BORDER_WIDTH);

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

        renderer.draw(new Line(p1, p2), style);
    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}
