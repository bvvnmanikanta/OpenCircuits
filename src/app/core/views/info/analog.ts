import { DefaultComponent } from "core/models/types/base/Component";

import { AnalogComponent, AnalogObj, AnalogPort, AnalogWire } from "../../models/types/analog";

import { ComponentInfoRecord, ObjInfoRecord } from "./base";
import { DefaultComponentPropInfo, GenPortInfo, GenWireInfo } from "./utils";


export const AnalogComponentInfo: ComponentInfoRecord<AnalogComponent> = {
    "AnalogNode": ({
        Default: (id) => ({ kind: "AnalogNode", ...DefaultComponent(id) }),
        PropInfo: DefaultComponentPropInfo,
    }),
    "Ground": ({
        Default: (id) => ({ kind: "Ground", ...DefaultComponent(id) }),
        PropInfo: DefaultComponentPropInfo,
    }),
    "Resistor": ({
        Default: (id) => ({ kind: "Resistor", ...DefaultComponent(id), resistance: 1000 }),
        PropInfo: {
            ...DefaultComponentPropInfo,
            "resistance": {
                type: "float",
                label: "Resistance",
                step: 100, min: 0,
            },
        },
    }),
    "VoltageSource": ({
        Default: (id) => ({
            kind: "VoltageSource", ...DefaultComponent(id),
            voltage: 5,
            v1: 0,
            td: 0,
            tr: 0.01,
            tf: 0.01,
            pw: 0.1,
            p: 0.2,
            ph: 0
        }),
        PropInfo: {
            ...DefaultComponentPropInfo,
            "voltage": {
                type: "float",
                label: "Voltage",
                step: 1, min: -10,
            },
            "v1": {
                type: "float",
                label: "Low Voltage",
                step: 1, min: -10,
            },
            "td": {
                type: "float",
                label: "Delay Time",
                step:1, min:-10,
            },
            "tr": {
                type: "float",
                label: "Rise Time",
                step:0.01, min:0,
            },
            "tf": {
                type: "float",
                label: "Fall Time",
                step:0.01, min:0,
            },
            "pw": {
                type: "float",
                label: "Pulse Width",
                step:0.1, min:0,
            },
            "p": {
                type: "float",
                label: "Period",
                step:0.1, min:0,
            },
            "ph": {
                type: "float",
                label: "Phase",
                step:1, min:0,
            },

        },
    }),
};

export const AnalogInfo: ObjInfoRecord<AnalogObj> = {
    "AnalogPort": GenPortInfo<AnalogPort>("AnalogPort"),
    "AnalogWire": GenWireInfo<AnalogWire>("AnalogWire"),
    ...AnalogComponentInfo,
} as const;
