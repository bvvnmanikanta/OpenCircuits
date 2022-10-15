import {Component} from "./base/Component";
import {Port}      from "./base/Port";
import {Wire}      from "./base/Wire";


export enum DigitalPortGroup {
    Input  = 0,
    Output = 1,
    Select = 2,
}

export type DigitalPort = Port      & { kind: "DigitalPort", group: DigitalPortGroup };
export type DigitalWire = Wire      & { kind: "DigitalWire" };
export type DigitalNode = Component & { kind: "DigitalNode" };

export type ANDGate = Component & { kind: "ANDGate" };
export type Switch  = Component & { kind: "Switch"  };
export type LED     = Component & { kind: "LED", color: string };

export type Encoder = Component & { kind: "Encoder" };

export type Decoder = Component & { kind: "Decoder" };

export type DigitalComponent =
    | DigitalNode
<<<<<<< HEAD
    | ANDGate
    | Encoder
    | Decoder;
=======
    | Switch
    | LED
    | ANDGate;
>>>>>>> 2426703fec11cdb7c20c89464557f9ead0afc885

export type DigitalObj = DigitalPort | DigitalWire | DigitalComponent;
