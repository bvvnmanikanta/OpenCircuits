import {Component} from "./base/Component";
import {Port}      from "./base/Port";
import {Wire}      from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type VoltageSource = Component & { kind: "VoltageSource", 
    voltage: number,
    v1: number,
    td: number,
    tr: number,
    tf: number,
    pw: number,
    p:  number,
    ph: number,
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
