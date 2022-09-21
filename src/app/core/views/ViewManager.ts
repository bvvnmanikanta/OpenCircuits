import {GUID} from "core/utils/GUID";

import {AnyObj} from "core/models/types";

import {CircuitController} from "core/controllers/CircuitController";

import {BaseView, RenderInfo} from "./BaseView";


const DEPTH_OFFSET = 100;

type ViewFactory<Obj extends AnyObj, Circuit extends CircuitController<AnyObj>> =
    (c: Circuit, o: Obj) => BaseView<Obj, Circuit>;

export type ViewRecord<Obj extends AnyObj, Circuit extends CircuitController<AnyObj>> =
    Record<Obj["kind"], ViewFactory<Obj, Circuit>>;

export class ViewManager<Obj extends AnyObj, Circuit extends CircuitController<AnyObj>> {
    protected readonly genView: ViewFactory<Obj, Circuit>;

    protected readonly circuit: Circuit;

    // Array of views, by layer sorted by depth
    // So views[1] means all the views at depth = 1
    protected views: Array<Map<GUID, BaseView<Obj, Circuit>>>;

    // Keep mapping of each entry and their associated depth for fast lookup
    protected depthMap: Map<GUID, number>;

    public constructor(circuit: Circuit, genView: ViewFactory<Obj, Circuit>) {
        this.circuit = circuit;
        this.genView = genView;
        this.views = [];
        this.depthMap = new Map();
    }

    public onAddObj(m: Obj) {
        const view = this.genView(this.circuit, m);
        const depth = view.getDepth() + DEPTH_OFFSET; // Shift so we can have "negative" depths
        if (depth < 0)
            throw new Error(`ViewManager: Received depth of ${depth} from view for ${m.kind}[${m.id}](${m.name})!`);
        // Add layer at depth if it doesn't exist
        if (!(depth in this.views))
            this.views[depth] = new Map();
        // Push this view to the layer
        this.views[depth].set(m.id, view);
        // Add to depth map as well
        this.depthMap.set(m.id, depth);
    }

    public onRemoveObj(m: Obj) {
        if (!this.depthMap.has(m.id))
            throw new Error(`ViewManager: Failed to remove view for ${m.kind}[${m.id}](${m.name})! No depth found!`);
        const depth = this.depthMap.get(m.id)!;
        this.depthMap.delete(m.id);
        if (!this.views[depth].delete(m.id))
            throw new Error(`ViewManager: Failed to remove view for ${m.kind}[${m.id}](${m.name})! Not found!`);
    }

    public render(info: RenderInfo) {
        // Render by layer: lower depths rendered before higher ones since
        //  a higher depth indicates it should be on-top
        this.views.forEach((layer, d) => {
            layer.forEach((view, id) => {
                view.render(info);
            });
        });
    }

    public getView(id: GUID) {
        if (!this.depthMap.has(id))
            throw new Error(`ViewManager: Failed to get view for [${id}]! No depth found!`);
        const depth = this.depthMap.get(id)!;
        if (!this.views[depth].has(id))
            throw new Error(`ViewManager: Failed to get view for [${id}]! Not found!`);
        return this.views[depth].get(id);
    }
}
