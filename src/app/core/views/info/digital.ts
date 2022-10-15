<<<<<<< HEAD
import {ANDGate, DigitalComponent, DigitalNode,
        DigitalObj, DigitalPort, DigitalWire, Encoder, Decoder} from "core/models/types/digital";
=======
import {DigitalComponent, DigitalObj, DigitalPort, DigitalWire} from "core/models/types/digital";
>>>>>>> 2426703fec11cdb7c20c89464557f9ead0afc885

import {DefaultComponent} from "core/models/types/base/Component";

import {ComponentInfoRecord, ObjInfoRecord}                 from "./base";
import {DefaultComponentPropInfo, GenPortInfo, GenWireInfo} from "./utils";


const DigitalPort = GenPortInfo<DigitalPort>("DigitalPort");
const DigitalWire = GenWireInfo<DigitalWire>("DigitalWire");

export const DigitalComponentInfo: ComponentInfoRecord<DigitalComponent> = {
<<<<<<< HEAD
    "DigitalNode": GenDigitalComponentInfo<DigitalNode>("DigitalNode"),
    "ANDGate":     GenDigitalComponentInfo<ANDGate>("ANDGate"),
    "Encoder":     GenDigitalComponentInfo<Encoder>("Encoder"),
    "Decoder":     GenDigitalComponentInfo<Decoder>("Decoder")
=======
    "DigitalNode": {
        Default:  (id) => ({ kind: "DigitalNode", ...DefaultComponent(id) }),
        PropInfo: DefaultComponentPropInfo,
    },
    "Switch": {
        Default:  (id) => ({ kind: "Switch", ...DefaultComponent(id) }),
        PropInfo: DefaultComponentPropInfo,
    },
    "LED": {
        Default:  (id) => ({ kind: "LED", ...DefaultComponent(id), color: "#ffffff" }),
        PropInfo: DefaultComponentPropInfo,
    },
    "ANDGate": {
        Default:  (id) => ({ kind: "ANDGate", ...DefaultComponent(id) }),
        PropInfo: DefaultComponentPropInfo,
    },
>>>>>>> 2426703fec11cdb7c20c89464557f9ead0afc885
};

export const DigitalInfo: ObjInfoRecord<DigitalObj> = {
    "DigitalPort": DigitalPort,
    "DigitalWire": DigitalWire,
    ...DigitalComponentInfo,
} as const;
