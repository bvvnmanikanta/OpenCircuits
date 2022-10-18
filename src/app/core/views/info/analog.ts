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
            low_voltage: 0,
            delay_time: 0,
            rise_time: 0.01,
            fall_time: 0.01,
            pulse_width: 0.1,
            period: 0.2,
            phase: 0
        }),
        PropInfo: {
            ...DefaultComponentPropInfo,
            "voltage": {
                type: "float",
                label: "Voltage",
                step: 1, min: -10,
            },
            "low_voltage": {
                type: "float",
                label: "Low Voltage",
                step: 1, min: -10,
            },
            "delay_time": {
                type: "float",
                label: "Delay Time",
                step:1, min:-10,
            },
            "rise_time": {
                type: "float",
                label: "Rise Time",
                step:0.01, min:0,
            },
            "fall_time": {
                type: "float",
                label: "Fall Time",
                step:0.01, min:0,
            },
            "pulse_width": {
                type: "float",
                label: "Pulse Width",
                step:0.1, min:0,
            },
            "period": {
                type: "float",
                label: "Period",
                step:0.1, min:0,
            },
            "phase": {
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
