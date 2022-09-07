import type {DigitalCircuitInfo} from "./DigitalCircuitInfo";
import type {IC}                 from "digital/models/ioobjects";


export type ICCircuitInfo = DigitalCircuitInfo & {
    ic?: IC;
}
