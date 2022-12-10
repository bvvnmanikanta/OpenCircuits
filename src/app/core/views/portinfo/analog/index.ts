
import {V} from "Vector";

import {AnalogComponent, DefaultAnalogPort} from "core/models/types/analog";

import {PortInfoRecord} from "../types";


const INDUCTOR_HEIGHT = 240/104*0.8;

const DefaultAnalogPortInfo = {
    Default:       DefaultAnalogPort,
    InitialConfig: 0,
    AllowChanges:  false,
} as const;

export const AnalogPortInfo: PortInfoRecord<AnalogComponent> = {
    "AnalogNode": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(0, 0), target: V(0, 0), dir: V(-1, 0) },
                { origin: V(0, 0), target: V(0, 0), dir: V(+1, 0) },
            ],
        }],
    },
    "Ground": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [{ origin: V(0, +0.3), target: V(0, +1), dir: V(0, +1) }],
        }],
    },
    "Resistor": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(-0.6, 0), target: V(-1.3, 0), dir: V(-1, 0) },
                { origin: V(+0.6, 0), target: V(+1.3, 0), dir: V(+1, 0) },
            ],
        }],
    },
    "Inductor": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(0, -INDUCTOR_HEIGHT/2), target: V(0, -INDUCTOR_HEIGHT), dir: V(0, -1) },
                { origin: V(0, +INDUCTOR_HEIGHT/2), target: V(0, +INDUCTOR_HEIGHT), dir: V(0, +1) },
            ],
        }],
    },
    "CurrentSource": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(0, -0.5), target: V(0, -1.3), dir: V(0, -1) },
                { origin: V(0, +0.5), target: V(0, +1.3), dir: V(0, +1) },
            ],
        }],
    },
};
