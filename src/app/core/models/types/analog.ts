import {Component} from "./base/Component";
import {Port}      from "./base/Port";
import {Wire}      from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type VoltageSource = Component & { kind: "VoltageSource", voltage: number };
//random line
export type AnalogComponent =
    | AnalogNode
    | Resistor
    | VoltageSource
    | Ground
    | Resistor;

export type AnalogObj = AnalogPort | AnalogWire | AnalogComponent;
