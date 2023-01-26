import {GetDebugInfo} from "core/internal/utils/Debug";
import {Schema} from "core/schema";
import {BaseObject} from "./BaseObject";
import {IWire} from "./interfaces/Wire";
import {Port} from "./Port";


export class Wire extends BaseObject implements IWire {
    public readonly baseKind = "Wire";

    protected getObj(): Schema.Wire {
        const obj = this.circuit.getObjByID(this.id);
        if (!obj)
            throw new Error(`API Wire: Attempted to get wire with ID ${this.id} could not find it!`);
        if (obj.baseKind !== "Wire")
            throw new Error(`API Wire: Attempted to get wire with ID ${this.id} but received ${GetDebugInfo(obj)} instead!`);
        return obj;
    }

    public get p1(): Port {
        return new Port(this.circuit, this.getObj().p1);
    }
    public get p2(): Port {
        return new Port(this.circuit, this.getObj().p2);
    }
}
