import {SVGDrawing} from "svg2canvas";

import {DEFAULT_BORDER_WIDTH, SELECTED_FILL_COLOR} from "core/utils/Constants";

import {V, Vector} from "Vector";

import {Rect}      from "math/Rect";
import {Transform} from "math/Transform";

import {DirtyVar} from "core/utils/DirtyVar";
import {Images}   from "core/utils/Images";

import {AnyComponent, AnyObj} from "core/models/types";

import {CircuitController} from "core/controllers/CircuitController";

import {BaseView, RenderInfo} from "./BaseView";


export abstract class ComponentView<
    Obj extends AnyComponent,
    Circuit extends CircuitController<AnyObj>,
> extends BaseView<Obj, Circuit> {
    protected transform: DirtyVar<Transform>;
    protected img?: SVGDrawing;

    public constructor(circuit: Circuit, obj: Obj, size?: Vector, imgName?: string) {
        super(circuit, obj);

        this.transform = new DirtyVar(
            () => new Transform(V(obj.x, obj.y), size, obj.angle),
        );

        // Get image if this view has one
        if (imgName) {
            const img = Images.GetImage(imgName);
            if (!img) {
                throw new Error(`ComponentView: failed to get image ${imgName} for` +
                                ` component ${obj.kind}[${obj.id}](${obj.name})`);
            }
            this.img = img;
        }
    }

    // TODO: pass in prop-key that changed and only respond to that
    public override onPropChange(): void {
        this.transform.setDirty();
    }

    protected override renderInternal(info: RenderInfo): void {
        const { renderer } = info;

        const selected = false; // selections.has(this.obj.id);

        // Transform into local space
        renderer.transform(this.transform.get());

        this.renderComponent(info);

        // Check if we should draw image
        if (!this.img)
            return;
        const tint = (selected ? SELECTED_FILL_COLOR : undefined);
        renderer.image(this.img, V(), this.transform.get().getSize(), tint);
    }

    protected abstract renderComponent(info: RenderInfo): void;

    protected override getBounds(): Rect {
        const t = this.transform.get();
        return new Rect(t.getPos(), t.getSize());
    }
}
