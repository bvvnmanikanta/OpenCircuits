import {V, Vector} from "Vector";

import {Rect} from "math/Rect";

import {CircuitInternal}   from "core/internal/impl/CircuitInternal";
import {CircuitLog}        from "core/internal/impl/CircuitLog";
import {ObjInfoProvider}   from "core/internal/impl/ComponentInfo";
import {DebugOptions}      from "core/internal/impl/DebugOptions";
import {SelectionsManager} from "core/internal/impl/SelectionsManager";
import {CircuitView}       from "core/internal/view/CircuitView";

import {Camera}    from "../Camera";
import {Circuit}   from "../Circuit";
import {Component} from "../Component";
import {Obj}       from "../Obj";
import {Port}      from "../Port";
import {Wire}      from "../Wire";

import {CircuitState}    from "./CircuitState";
import {CircuitDocument} from "core/internal/impl/CircuitDocument";


export abstract class CircuitImpl<
    ComponentT extends Component = Component,
    WireT extends Wire = Wire,
    PortT extends Port = Port,
> implements Circuit, CircuitState<ComponentT, WireT, PortT> {
    public circuit: CircuitInternal;
    public view?: CircuitView;

    public selections: SelectionsManager;

    public isLocked: boolean;

    public constructor(provider: ObjInfoProvider) {
        this.circuit = new CircuitInternal(new CircuitLog(), new CircuitDocument(provider));
        this.view = undefined;

        this.selections = new SelectionsManager();

        this.isLocked = false;
    }

    public abstract constructComponent(id: string): ComponentT;
    public abstract constructWire(id: string): WireT;
    public abstract constructPort(id: string): PortT;

    // Transactions.  All ops between a begin/commit pair are applied atomically (For collaborative editing, undo/redo)
    // All queries within a transaction are coherent.
    // All ops outside begin/commit are applied individually
    public beginTransaction(): void {
        this.circuit.beginTransaction();
    }
    public commitTransaction(): void {
        this.circuit.commitTransaction();
    }
    public cancelTransaction(): void {
        this.circuit.cancelTransaction();
    }

    public get id(): string {
        throw new Error("Method not implemented.");
    }

    public set name(val: string) {
        throw new Error("Method not implemented.");
    }
    public get name(): string {
        throw new Error("Method not implemented.");
    }

    public set desc(val: string) {
        throw new Error("Method not implemented.");
    }
    public get desc(): string {
        throw new Error("Method not implemented.");
    }

    public set thumbnail(val: string) {
        throw new Error("Method not implemented.");
    }
    public get thumbnail(): string {
        throw new Error("Method not implemented.");
    }

    public set locked(val: boolean) {
        throw new Error("Unimplemented");
    }
    public get locked(): boolean {
        // TODO: Decide which level to enforce this at.  Is it serialized?
        throw new Error("Unimplemented");
    }

    public set simEnabled(val: boolean) {
        throw new Error("Unimplemented");
    }
    public get simEnabled(): boolean {
        throw new Error("Unimplemented");
    }

    public set debugOptions(options: Partial<DebugOptions>) {
        throw new Error("Unimplemented");
    }
    public get debugOptions(): DebugOptions {
        throw new Error("Unimplemented");
    }

    public get camera(): Camera {
        throw new Error("Method not implemented.");
    }

    // Queries
    public pickObjectAt(pt: Vector): ComponentT | WireT | PortT | undefined {
        throw new Error("Unimplemented");
    }
    public pickObjectRange(bounds: Rect): Array<ComponentT | WireT | PortT> {
        throw new Error("Unimplemented");
    }

    public selectedObjs(): Obj[] {
        return this.selections.get()
               .map((id) => this.getObj(id))
               .filter((obj) => (obj !== undefined)) as Obj[];
    }

    public getComponent(id: string): ComponentT | undefined {
        if (!this.circuit.getCompByID(id))
            return undefined;
        return this.constructComponent(id);
    }
    public getWire(id: string): WireT | undefined {
        if (!this.circuit.getWireByID(id))
            return undefined;
        return this.constructWire(id);
    }
    public getPort(id: string): PortT | undefined {
        if (!this.circuit.getPortByID(id))
            return undefined;
        return this.constructPort(id);
    }
    public getObj(id: string): ComponentT | WireT | PortT | undefined {
        if (this.circuit.hasComp(id))
            return this.getComponent(id);
        if (this.circuit.hasWire(id))
            return this.getWire(id);
        if (this.circuit.hasPort(id))
            return this.getPort(id);
        return undefined;
    }
    public getObjs(): Obj[] {
        return [...this.circuit.getObjs()]
            .map((id) => this.getObj(id)!);
    }
    public getComponentInfo(kind: string): ComponentT["info"] | undefined {
        throw new Error("Method not implemented.");
    }

    public selectionsMidpoint(space: Vector.Spaces): Vector {
        // TODO(renr)
        //  For now, ignore the `space`, and ignore any non-Component
        //   objects that are selected
        //  From these components, average their positions
        const allComponents = this.selections.get()
                              .map((id) => this.getComponent(id))
                              .filter((comp) => (comp !== undefined)) as Component[];

        // Case: no components are selected
        if (allComponents.length === 0)
            return V(0,0)

        // Case: One or more components are selected
        const sumPosition = allComponents
                            .map((c) => c.pos)
                            .reduce((sum, v) => sum.add(v));

        // Calculate average position
        return sumPosition.scale(1 / allComponents.length);
    }

    // Object manipulation
    public placeComponentAt(pt: Vector, kind: string): ComponentT {
        const info = this.circuit.getComponentInfo(kind);

        // TODO: Deal with `pt` being in screen space
        this.circuit.beginTransaction();

        // Place raw component (TODO: unwrap...)
        const id = this.circuit.placeComponent(kind, { x: pt.x, y: pt.y }).unwrap();

        // Set its config to place ports
        this.circuit.setPortConfig(id, info.defaultPortConfig).unwrap();

        this.circuit.commitTransaction();

        return this.constructComponent(id);
    }
    // Wire connection can fail if i.e. p1 is reference-equal to p2
    public abstract connectWire(p1: PortT, p2: PortT): WireT | undefined;

    public deleteObjs(objs: Array<ComponentT | WireT | PortT>): void {
        // TODO(friedj)
        //  See `placeComponentAt` for some general guidance
        //  Note that to delete a Component, you have to set its "Port Config" to `{}` first
        //   which will remove all of its ports
        //  Then it's safe to delete the Component directly
        //  And also note that deleting Ports is a no-op, just ignore that case
        throw new Error("Unimplemented");
    }
    public clearSelections(): void {
        // TODO(callac5)
        throw new Error("Unimplemented");
    }

    public createIC(objs: Array<ComponentT | WireT | PortT>): Circuit | undefined {
        throw new Error("Unimplemented");
    }
    public getICs(): Circuit[] {
        throw new Error("Method not implemented.");
    }

    public undo(): boolean {
        throw new Error("Unimplemented");
    }
    public redo(): boolean {
        throw new Error("Unimplemented");
    }

    public copy(): Circuit {
        throw new Error("Method not implemented.");
    }

    public reset(): void {
        throw new Error("Method not implemented.");
    }

    public serialize(): string {
        throw new Error("Method not implemented.");
    }
    public deserialize(data: string): void {
        throw new Error("Method not implemented.");
    }

    public addRenderCallback(cb: () => void): void {
        throw new Error("Unimplemented");
    }

    public subscribe(cb: (ev: any) => void): () => void {
        throw new Error("Method not implemented.");
    }
}
