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
}
