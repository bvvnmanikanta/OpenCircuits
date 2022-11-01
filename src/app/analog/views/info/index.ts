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
        { id: "waveform", type: "string[]", key: "waveform", label: "waveform", options: [["DC", "a"],["Pulse", "b"],["Sine", "c"]]},
        
    ],
};
/*
the three sub components for voltage source, they should be incorporated
into voltagesource so that voltagesource would be a group object consists 
of ConstVPropInfo, PulseVPropInfo, and SineVPropInfo.
*/

const ConstVPropInfo = {
    id: "waveform-const-group",
    type: "group",
    //isActive:  (states) => (states.every((state) => state["waveform"] == "DC")),
    info: [{ id: "v", type:"float", key: "v", label: "Voltage", step: 0.1, min: 0}]
}


const PulseVPropInfo = {
    id: "waveform-pulse-group",
    type: "group",
    //isActive: (states) => (states.every((state) => state["waveform"] === "DC Pulse")),
    info: [
    { id: "v", type:"float", key: "v", label: "Voltage", step: 0.1, min: 0},
    { id: "v1", type: "float", key: "v1", label: "Voltage High", step: 0.1, min: 0},
    { id: "tf", type: "float", key: "tf", label: "Fall Time",  step: 0.1, min:0},
    { id: "pw", type: "float", key: "pw", label: "Pulse Width", step: 0.1, min:0},
    { id: "p", type: "float", key: "p", label: "Period", step: 0.1, min:0},
    { id: "ph", type: "float", key: "ph", label: "Phase", step: 0.1, min:0},]
}

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