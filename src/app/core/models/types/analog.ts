import {Component, ComponentFactory, DefaultComponent} from "./base/Component";
import {DefaultPort, Port, PortFactory}                from "./base/Port";
import {DefaultWire, Wire, WireFactory}                from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type ConstantVoltageSourceProps = {
    v: number; // voltage
  }
export type PulseVoltageSourceProps = {
    v0: number; // Low voltage
    v1: number; // High voltage
    td: number; // Delay time
    tr: number; // Rise time
    tf: number; // Fall time
    pw: number; // Pulse Width
    p:  number; // Period
    ph: number; // Phase
  }
export  type SineVoltageSourceProps = {
    vo: number; // Offset voltage
    v1: number; // Amplitude voltage
    f:  number; // frequency
    td: number; // Delay time
    d:  number; // Damping factor
    ph: number; // Phase
  }

export type VoltageSource = Component & {
kind: "VoltageSource";
waveform: "DC" | "DC Pulse" | "DC Sine";
} & ConstantVoltageSourceProps & PulseVoltageSourceProps & SineVoltageSourceProps;

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
    "VoltageSource": (id) => ({ ...DefaultComponent(id), kind: "VoltageSource", 
    waveform: "DC", v: 5, 
    v0: 0, v1: 5, td: 0.1, tr: 0.01, tf: 0.01, pw: 0.1, p: 0.1, ph: 0,
    f: 100, d: 1, vo: 0}),
};

export const DefaultAnalogPort: PortFactory<AnalogPort> =
    (id, parent, group, index) => ({ ...DefaultPort(id, parent, group, index), kind: "AnalogPort" });

export const DefaultAnalogWire: WireFactory<AnalogWire> =
    (id, p1, p2) => ({ ...DefaultWire(id, p1, p2), kind: "AnalogWire" });
