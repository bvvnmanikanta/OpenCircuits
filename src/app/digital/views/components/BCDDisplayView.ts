import {DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CURVE_BORDER_WIDTH, DEFAULT_FILL_COLOR, SELECTED_BORDER_COLOR, SELECTED_FILL_COLOR, SEGMENT_DISPLAY_WIDTH, DEFAULT_ON_COLOR} from "core/utils/Constants";

import {V, Vector} from "Vector";

import {Rect} from "math/Rect";

import {Style} from "core/utils/rendering/Style";

import {Line} from "core/utils/rendering/shapes/Line";

import {BCDDisplay} from "core/models/types/digital";

import {RenderInfo}    from "core/views/BaseView";
import {ComponentView} from "core/views/ComponentView";

import {DigitalViewInfo} from "../DigitalViewInfo";
import { Rectangle } from "core/utils/rendering/shapes/Rectangle";
import { Images } from "core/utils/Images";
import { Segments, SEGMENT_SCALE } from "./Segments";
import { type } from "os";
import { Renderer } from "core/utils/rendering/Renderer";
import { SegmentDisplayView } from "./SegmentDisplayView";
import { BCDtoDecimal } from "math/MathUtils";
import { BCDFont } from "./BCDFont";


export class BCDDisplayView extends ComponentView<BCDDisplay, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: BCDDisplay) {
        super(info, obj);
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        // Get size of model
        // const size = this.transform.get().getSize();
		const size = V(1, 2); // TODO figure out how to fix sizing

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
		const fillCol = (selected ? SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR);
        const style = new Style(fillCol, borderCol, DEFAULT_CURVE_BORDER_WIDTH);
		renderer.draw(new Rectangle(V(), size), style);

        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs");

        // Get current number of inputs
        const numInputs = inputs.length; // always 4
        const segmentCount = this.obj.segmentCount;

        // Draw line to visually match input ports
        const l1 = -(numInputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) - DEFAULT_BORDER_WIDTH/2;
        const l2 =  (numInputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2;

        const s = (size.x-DEFAULT_BORDER_WIDTH)/2;
        const p1 = V(-s, l1);
        const p2 = V(-s, l2);

        renderer.draw(new Line(p1, p2), style);

        // draw segments
        const segments = this.getSegments(segmentCount);
        const dec = BCDtoDecimal(inputs.map((p) => this.info.sim.getSignal(p).valueOf() == 1 ? true : false));
        const font = BCDFont[segmentCount];
        const glyph = font[dec] as number[];
        for (let i = segmentCount - 1; i >= 0; --i) { // TODO 9 segments display incorrectly
            const pos = segments[i][0].scale(V(SEGMENT_DISPLAY_WIDTH));
            const on = font && glyph ? glyph.includes(i) : false;
            const col = (on ? DEFAULT_ON_COLOR : (selected ? SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR));
            const img = Images.GetImage(segments[i][1]);
            const size = V(img.width, img.height).scale(SEGMENT_SCALE);
            renderer.image(img, pos, size, col);
        }
    }

    protected getSegments(segmentCount: number): Array<[Vector, string]> { // TODO do i need to allow for more than 7 segments??
        const segments = Segments[`${segmentCount}`];
        // turns array from ./Segments.ts into array of Vectors and image file names
        return segments.map((value: [number[], string]) =>
            [V(value[0][0], value[0][1]), `segment_${value[1]}.svg`]
        );
    }

    public override getBounds(): Rect {
        // Get current number of inputs

        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}
