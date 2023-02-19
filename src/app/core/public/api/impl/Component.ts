import {V, Vector} from "Vector";

import {AddErrE}                 from "core/utils/MultiError";
import {FromConcatenatedEntries} from "core/utils/Functions";

import {Schema} from "core/schema";

import {Component} from "../Component";
import {Port}      from "../Port";
import {Wire}      from "../Wire";

import {BaseObjectImpl} from "./BaseObject";
import {CircuitState}   from "./CircuitState";


export abstract class ComponentImpl<
    ComponentT extends Component = Component,
    WireT extends Wire = Wire,
    PortT extends Port = Port,
    State extends CircuitState<ComponentT, WireT, PortT> = CircuitState<ComponentT, WireT, PortT>
> extends BaseObjectImpl<State> implements Component {
    public readonly baseKind = "Component";

    protected getObj(): Schema.Component {
        return this.internal.getCompByID(this.id)
            .mapErr(AddErrE(`API Component: Attempted to get component with ID ${this.id} could not find it!`))
            .unwrap();
    }

    public abstract get info(): ComponentT["info"];

    public set x(val: number) {
        this.internal.setPropFor(this.id, "x", val);
    }
    public get x(): number {
        return (this.getObj().props.x ?? 0);
    }
    public set y(val: number) {
        this.internal.setPropFor(this.id, "y", val);
    }
    public get y(): number {
        return (this.getObj().props.y ?? 0);
    }

    public set pos(val: Vector) {
        this.internal.setPropFor<Schema.Component, "x">(this.id, "x", val.x).unwrap();
        this.internal.setPropFor<Schema.Component, "y">(this.id, "y", val.y).unwrap();
    }
    public get pos(): Vector {
        const obj = this.getObj();

        return V((obj.props.x ?? 0), (obj.props.y ?? 0));
    }

    public set angle(val: number) {
        this.internal.setPropFor<Schema.Component, "angle">(this.id, "angle", val).unwrap();
    }
    public get angle(): number {
        return (this.getObj().props.angle ?? 0);
    }

    public get ports(): Record<string, PortT[]> {
        return FromConcatenatedEntries(
            [...this.internal.getPortsForComponent(this.id).unwrap()]
            .map((id) => this.circuit.constructPort(id))
            .map((p) => [p.group, p])
        );
    }

    public firstAvailable(group: string): PortT | undefined {
        throw new Error("Unimplemented!");
    }
}
