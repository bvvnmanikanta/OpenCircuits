import {Schema} from "core/schema";

import {V, Vector}     from "../../utils/math/Vector";
import {Component}     from "../Component";
import {ComponentInfo} from "../ComponentInfo";
import {Port}          from "../Port";

import {BaseObjectImpl} from "./BaseObject";
import {PortImpl}       from "./Port";


export class ComponentImpl extends BaseObjectImpl implements Component {
    public readonly baseKind = "Component";

    protected getObj(): Schema.Component {
        const obj = this.circuit.getCompByID(this.id);
        if (!obj)
            throw new Error(`API Component: Attempted to get component with ID ${this.id} could not find it!`);
        return obj;
    }

    public get info(): ComponentInfo {
        throw new Error("Unimplemented");
    }

    public set pos(val: Vector) {
        // TODO: make this type-safe
        this.circuit.setPropForDyn(this.id, "x", val.x);
        this.circuit.setPropForDyn(this.id, "y", val.y);
    }
    public get pos(): Vector {
        const obj = this.getObj();

        return V((obj.props.x ?? 0), (obj.props.y ?? 0));
    }

    public set angle(val: number) {
        this.circuit.setPropForDyn(this.id, "angle", val);
    }
    public get angle(): number {
        return (this.getObj().props.angle ?? 0);
    }

    public get ports(): Port[] {
        return [...this.circuit.getPortsForComponent(this.id)]
            .map((id) => new PortImpl(this.circuit, id));
    }
}
