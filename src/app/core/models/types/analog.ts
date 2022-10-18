import {Component, ComponentFactory, DefaultComponent} from "./base/Component";
import {DefaultPort, Port, PortFactory}                from "./base/Port";
import {DefaultWire, Wire, WireFactory}                from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type VoltageSource = Component & { kind: "VoltageSource", 
    voltage: number,
    low_voltage: number,
    delay_time: number,
    rise_time: number,
    fall_time: number,
    pulse_width: number,
    period:  number,
    phase: number,
 };
//random line
//random line 2
export type AnalogComponent =
    | AnalogNode
    | Resistor
    | VoltageSource
    | Ground
    | Resistor;

export type AnalogObj = AnalogPort | AnalogWire | AnalogComponent;


export const DefaultAnalogComponent: { [C in AnalogComponent as C["kind"]]: ComponentFactory<C> } = {
    "AnalogNode": (id) => ({ ...DefaultComponent(id), kind: "AnalogNode"                 }),
    "Ground":     (id) => ({ ...DefaultComponent(id), kind: "Ground"                     }),
    "Resistor":   (id) => ({ ...DefaultComponent(id), kind: "Resistor", resistance: 1000 }),
    "VoltageSource": (id) => ({ ...DefaultComponent(id), kind: "VoltageSource", voltage: 5, low_voltage: 0, delay_time: 0,
    rise_time: 0.01, fall_time: 0.01, pulse_width: 0.1, period: 0.2, phase: 0}),
};

export const DefaultAnalogPort: PortFactory<AnalogPort> =
    (id, parent, group, index) => ({ ...DefaultPort(id, parent, group, index), kind: "AnalogPort" });

export const DefaultAnalogWire: WireFactory<AnalogWire> =
    (id, p1, p2) => ({ ...DefaultWire(id, p1, p2), kind: "AnalogWire" });
