import {ANDGate, DigitalComponent, DigitalNode,
        DigitalObj, DigitalPort, DigitalWire, JKFlipFlop} from "core/models/types/digital";

import {ComponentInfoRecord, ObjInfoRecord}         from "./base";
import {GenComponentInfo, GenPortInfo, GenWireInfo} from "./utils";


const GenDigitalComponentInfo = <C extends DigitalComponent>(kind: C["kind"]) => (
    GenComponentInfo<C>(kind)
);

const DigitalPort = GenPortInfo<DigitalPort>("DigitalPort");
const DigitalWire = GenWireInfo<DigitalWire>("DigitalWire");

export const DigitalComponentInfo: ComponentInfoRecord<DigitalComponent> = {
    "DigitalNode": GenDigitalComponentInfo<DigitalNode>("DigitalNode"),
    "ANDGate":     GenDigitalComponentInfo<ANDGate>("ANDGate"),
    "JKFlipFlop":  GenDigitalComponentInfo<JKFlipFlop>("JKFlipFlop"),
};

export const DigitalInfo: ObjInfoRecord<DigitalObj> = {
    "DigitalPort": DigitalPort,
    "DigitalWire": DigitalWire,
    ...DigitalComponentInfo,
} as const;
