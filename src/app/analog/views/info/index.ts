import {PropInfoRecord} from "core/models/PropInfo";

import {AnalogObj} from "core/models/types/analog";

import {DefaultComponentPropInfo, DefaultPortPropInfo, DefaultWirePropInfo} from "core/views/DefaultPropInfo";


export const AnalogPropInfo: PropInfoRecord<AnalogObj> = {
    "AnalogPort": DefaultPortPropInfo,
    "AnalogWire": DefaultWirePropInfo,
    "AnalogNode": DefaultComponentPropInfo,

    "Resistor": {
        ...DefaultComponentPropInfo,
        "resistance": { type: "float", label: "Resistance", step: 100, min: 0 },
    },
    "Ground": DefaultComponentPropInfo,
    "VoltageSource":{
        ...DefaultComponentPropInfo,
        "v" : {type: "float", label: "Voltage", step: 0.1, min: 0},
        "v1": {type: "float", label: "Voltage High", step: 0.1, min: 0},
        "waveform": {type: "string[]", label: "Waveform", options: [["DC", "a"],["Pulse", "b"],["Sine", "c"]]},//cant use string[] beacuse of readonly
    }
};
