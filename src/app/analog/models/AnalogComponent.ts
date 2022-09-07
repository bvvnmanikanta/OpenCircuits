import type {AnalogWire}     from "./index";
import type {NetlistElement} from "./sim/Netlist";
import type {Prop}           from "core/models/PropInfo";
import type {ClampedValue}   from "math/ClampedValue";
import type {Vector}         from "Vector";

import {serialize} from "serialeazy";

import {Component} from "core/models/Component";

import {PortSet} from "core/models/ports/PortSets";

import {Positioner} from "core/models/ports/positioners/Positioner";

import {AnalogCircuitDesigner, AnalogPort} from "./index";


export abstract class AnalogComponent extends Component {
    @serialize
    protected designer?: AnalogCircuitDesigner;

    @serialize
    protected ports: PortSet<AnalogPort>;


    protected constructor(portCount: ClampedValue, size: Vector,
                          portPositioner: Positioner<AnalogPort> = new Positioner<AnalogPort>("left"),
                          initialProps: Record<string, Prop> = {}) {
        super(size, initialProps);

        this.ports = new PortSet<AnalogPort>(this, portCount, portPositioner, AnalogPort);
        this.props = initialProps;
    }

    public setDesigner(designer?: AnalogCircuitDesigner): void {
        this.designer = designer;
    }

    public setPortCount(val: number): void {
        this.ports.setPortCount(val);
        this.onTransformChange();
    }

    public getNetlistSymbol(): NetlistElement["symbol"] | undefined {
        return undefined;
    }

    public getNetlistValues(): NetlistElement["values"] {
        return [];
    }

    public getPort(i: number): AnalogPort {
        return this.ports.get(i);
    }

    public getPortPos(i: number): Vector {
        return this.getPort(i).getWorldTargetPos();
    }

    public getPorts(): AnalogPort[] {
        return this.ports.getPorts();
    }

    public getPortCount(): ClampedValue {
        return this.ports.getCount();
    }

    public numPorts(): number {
        return this.ports.length;
    }

    public getConnections(): AnalogWire[] {
        // Get each wire connected to each port and then filter out the null ones
        return this.getPorts().flatMap((p) => p.getWires())
                .filter((w) => !!w);
    }

    public getDesigner(): AnalogCircuitDesigner | undefined {
        return this.designer;
    }

}
