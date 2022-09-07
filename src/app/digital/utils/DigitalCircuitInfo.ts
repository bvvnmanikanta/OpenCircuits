import type {CircuitInfo}            from "core/utils/CircuitInfo";
import type {DigitalCircuitDesigner} from "digital/models";


export type DigitalCircuitInfo = Omit<CircuitInfo, "designer"> & {
    designer: DigitalCircuitDesigner;
}
