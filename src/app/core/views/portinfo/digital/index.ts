import {DEFAULT_BORDER_WIDTH} from "core/utils/Constants";

import {V} from "Vector";

import {DefaultDigitalPort, DigitalComponent} from "core/models/types/digital";

import {CalcPortPos, CalcPortPositions} from "../positioning/utils";
import {PortInfoRecord}                 from "../types";


const DefaultDigitalPortInfo = {
    Default:       DefaultDigitalPort,
    InitialConfig: 0,
    AllowChanges:  false,
} as const;

export const DigitalPortInfo: PortInfoRecord<DigitalComponent> = {
    "DigitalNode": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "inputs":  [{ origin: V(0, 0), target: V(0, 0), dir: V(-1, 0) }],
            "outputs": [{ origin: V(0, 0), target: V(0, 0), dir: V(+1, 0) }],
        }],
    },
    "Switch": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "outputs": [{ origin: V(0.62, 0), target: V(1.32, 0), dir: V(+1, 0) }],
        }],
    },
    "LED": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "inputs": [{ origin: V(0, -0.5), target: V(0, -2), dir: V(0, -1) }],
        }],
    },
    "ANDGate": {
        ...DefaultDigitalPortInfo,
        AllowChanges: true,
        ChangeGroup:  "inputs",

        // Generate configs for 2->8 input ports
        PositionConfigs: [2,3,4,5,6,7,8].map((numInputs) => ({
            "inputs":  CalcPortPositions(numInputs, 0.5 - DEFAULT_BORDER_WIDTH/2, 1, V(-1, 0)),
            "outputs": [CalcPortPos(V(0.5, 0), V(1, 0))], // 1 output
        })),
    },
    "Encoder": {
        Default:       DigitalInfo["DigitalPort"].Default,
        InitialConfig: "4,2",
        AllowChanges:  true,
        ChangeGroup:   DigitalPortGroup.Output,

        Positions: GenPortConfig(
            [1,2,3,4,5,6,7,8],
            (numOutputs) => {
                const width = (1+ (numOutputs - 1)/20); 
                return {
                    0: CalcPortPositions(2 ** numOutputs, 0.5, width, V(-1, 0)),
                    1: CalcPortPositions(numOutputs     , 0.5, width, V(+1, 0)),
                };
            },
        ),
    },

    "Decoder": {
        Default:       DigitalInfo["DigitalPort"].Default,
        InitialConfig: "2,4",
        AllowChanges:  true,
        ChangeGroup:   DigitalPortGroup.Input,

        Positions: GenPortConfig(
            [1,2,3,4,5,6,7,8],
            (numInputs) => {
                const width = (1+ (numInputs - 1)/20)
                return {
                    0: CalcPortPositions(numInputs     , 0.5, width, V(+1, 0)),
                    1: CalcPortPositions(2 ** numInputs, 0.5, width, V(-1, 0)),
                }
            },
        ),
    },


};
