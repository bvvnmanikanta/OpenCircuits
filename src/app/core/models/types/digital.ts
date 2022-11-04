import {Component, ComponentFactory, DefaultComponent} from "./base/Component";
import {DefaultPort, Port, PortFactory}                from "./base/Port";
import {DefaultWire, Wire, WireFactory}                from "./base/Wire";


export type DigitalPort = Port      & { kind: "DigitalPort" };
export type DigitalWire = Wire      & { kind: "DigitalWire" };
export type DigitalNode = Component & { kind: "DigitalNode" };

export type ANDGate = Component & { kind: "ANDGate" };
export type Switch  = Component & { kind: "Switch"  };
export type LED     = Component & { kind: "LED", color: string };

export type Encoder = Component & { kind: "Encoder" };
export type Decoder = Component & { kind: "Decoder" };

export type DigitalComponent =
    | DigitalNode
    | Switch
    | LED
    | ANDGate
    | Encoder
    | Decoder;

export type DigitalObj = DigitalPort | DigitalWire | DigitalComponent;


export const DefaultDigitalComponent: { [C in DigitalComponent as C["kind"]]: ComponentFactory<C> } = {
    "DigitalNode": (id) => ({ ...DefaultComponent(id), kind: "DigitalNode"           }),
    "Switch":      (id) => ({ ...DefaultComponent(id), kind: "Switch"                }),
    "LED":         (id) => ({ ...DefaultComponent(id), kind: "LED", color: "#ffffff" }),
    "ANDGate":     (id) => ({ ...DefaultComponent(id), kind: "ANDGate"               }),
    "Encoder":     (id) => ({ ...DefaultComponent(id), kind: "Encoder"               }),
    "Decoder":     (id) => ({ ...DefaultComponent(id), kind: "Decoder"               }),
};

export const DefaultDigitalPort: PortFactory<DigitalPort> =
    (id, parent, group, index) => ({ ...DefaultPort(id, parent, group, index), kind: "DigitalPort" });

export const DefaultDigitalWire: WireFactory<DigitalWire> =
    (id, p1, p2) => ({ ...DefaultWire(id, p1, p2), kind: "DigitalWire" });
