import {Component, ComponentFactory, DefaultComponent} from "./base/Component";
import {DefaultPort, Port, PortFactory}                from "./base/Port";
import {DefaultWire, Wire, WireFactory}                from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type Inductor = Component & { kind: "Inductor", inductance: number };

export type CurrentSource = Component & { kind: "CurrentSource", amperage: number };



export type AnalogComponent =
    | AnalogNode
    | Ground
    | Resistor
    | Inductor
    | CurrentSource;

export type AnalogObj = AnalogPort | AnalogWire | AnalogComponent;


export const DefaultAnalogComponent: { [C in AnalogComponent as C["kind"]]: ComponentFactory<C> } = {
    "AnalogNode":    (id) => ({ ...DefaultComponent(id), kind: "AnalogNode"                 }),
    "Ground":        (id) => ({ ...DefaultComponent(id), kind: "Ground"                     }),
    "Resistor":      (id) => ({ ...DefaultComponent(id), kind: "Resistor", resistance: 1000 }),
    "Inductor":      (id) => ({ ...DefaultComponent(id), kind: "Inductor", inductance: 10   }),
    "CurrentSource": (id) => ({ ...DefaultComponent(id), kind: "CurrentSource", amperage: 1 })};

export const DefaultAnalogPort: PortFactory<AnalogPort> =
    (id, parent, group, index) => ({ ...DefaultPort(id, parent, group, index), kind: "AnalogPort" });

export const DefaultAnalogWire: WireFactory<AnalogWire> =
    (id, p1, p2) => ({ ...DefaultWire(id, p1, p2), kind: "AnalogWire" });
