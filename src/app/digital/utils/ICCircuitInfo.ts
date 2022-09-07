import type {IC} from "digital/models/ioobjects";

import type {DigitalCircuitInfo} from "./DigitalCircuitInfo";


export type ICCircuitInfo = DigitalCircuitInfo & {
    ic?: IC;
}
