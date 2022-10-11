import {Component} from "./base/Component";
import {Port}      from "./base/Port";
import {Wire}      from "./base/Wire";


export type AnalogPort = Port & { kind: "AnalogPort" }
export type AnalogWire = Wire & { kind: "AnalogWire" }

export type AnalogNode = Component & { kind: "AnalogNode" };

export type Resistor = Component & { kind: "Resistor" };

export type VoltageSource = Component & { kind: "VoltageSource" };
//random line
//random line 2
export type AnalogComponent =
    | AnalogNode
    | Resistor
    | VoltageSource;

export type AnalogObj = AnalogPort | AnalogWire | AnalogComponent;
