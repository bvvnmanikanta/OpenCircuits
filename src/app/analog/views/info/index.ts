import {PropInfoRecord} from "core/models/PropInfo";

import {AnalogObj} from "core/models/types/analog";

import {DefaultComponentPropInfo, DefaultPortPropInfo, DefaultWirePropInfo} from "core/views/DefaultPropInfo";


export const AnalogPropInfo: PropInfoRecord<AnalogObj> = {
    "AnalogPort": DefaultPortPropInfo,
    "AnalogWire": DefaultWirePropInfo,
    "AnalogNode": DefaultComponentPropInfo,

    "Resistor": [
        ...DefaultComponentPropInfo,
        { id: "resistance", type: "float", key: "resistance", label: "Resistance", step: 100, min: 0 },
    ],

    "Ground": DefaultComponentPropInfo,

    "VoltageSource":[
        ...DefaultComponentPropInfo,
        { id: "v", type:"float", key: "v", label: "Voltage", step: 0.1, min: 0},
        { id: "v1", type: "float", key: "v1", label: "Voltage High", step: 0.1, min: 0},
        { id: "waveform", type: "string[]", key: "waveform", label: "Waveform", options: [["DC", "a"],["Pulse", "b"],["Sine", "c"]]},
        { id: "td", type: "float", key: "td", label: "Time Delay", step: 0.1, min:0},
        { id: "tr", type: "float", key: "tr", label: "Rise Time",  step: 0.1, min:0},
        { id: "tf", type: "float", key: "tf", label: "Fall Time",  step: 0.1, min:0},


const SineVPropInfo ={
    id: "waveform-sine-group",
    type: "group",
    //isActive: (states) => (states.every((state) => state["waveform"] === "DC Sine")),
    info: [
    { id: "v1", type: "float", key:"v1", label: "Offset Voltage", step: 0.1, min: 0},
    { id: "v", type: "float", key:"v", label: "Amplitude Voltage", step: 0.1, min: 0},
    { id: "f", type: "float", key:"f", label: "frequency", step: 0.1, min: 0},
    { id: "td", type: "float", key:"td", label: "Time Delay", step: 0.1, min: 0},
    { id: "d", type: "float", key:"d", label: "Dampen Factor", step: 0.1, min: 0},
    ]

}
