import {AnalogComponent} from "core/models/types/analog";

import {NetlistElement} from "./Netlist";


// Netlist info is a function that returns a tuple of its NGSpice symbol and values
type NetlistInfo<C extends AnalogComponent> = ((c: C) => [NetlistElement["symbol"], NetlistElement["values"]]);

type NetlistInfoRecord = {
    // The kind of every analog component
    [Comp in AnalogComponent as Comp["kind"]]:
        // Mapped to a callback function (or undefined)
        NetlistInfo<Comp> | undefined;
}

/**
 * This is a list of all the netlist information for every Analog component in the circuit.
 *
 * The information is a function that takes in an instance of the corresponding model
 * and returns the Netlist info for that instance.
 *
 * The info is represted as a tuple of the components "Symbol" and "values".
 * The symbol must be a NGSpice netlist symbol found in in https://ngspice.sourceforge.io/docs/ngspice-manual.pdf
 * And the values must be a list of strings representing the NGSpice parameters for that element.
 *
 * Note that you can also specify `undefined` to represent a component that doesn't need NGSpice info
 *  (and should be ignored).
 */
export const AllNetlistInfo: NetlistInfoRecord = {
    // AnalogNode is purely a user-facing component and has no effect on the actual circuit sim
    "AnalogNode": undefined,

    // Ground is a very special case so has no specified information
    "Ground": undefined,

    "Resistor": (r) => ["R", [`${r.resistance}`]],

/*
    Currently the simulation is not implimented, but the voltage source DC should work normally. This is based off of 
    the resistor which is done above. PulseVoltageSourceProps and SineVoltageSourceProps needs to be done as well.

    PulseVoltageSourceProps:
    v1: number; // Low voltage
    v: number; // High voltage
    td: number; // Delay time
    tr: number; // Rise time
    tf: number; // Fall time
    pw: number; // Pulse Width
    p:  number; // Period
    ph: number; // Phase

    SineVoltageSourceProps:
    vo: number; // Offset voltage
    v1: number; // Amplitude voltage
    f:  number; // frequency
    td: number; // Delay time
    d:  number; // Damping factor
    ph: number; // Phase
*/
    "VoltageSource": (v) => ["V", [`${v.v}`]],//ConstantVoltageSourceProps
};

export function GetNetlistInfo(comp: AnalogComponent) {
    const info = AllNetlistInfo[comp.kind] as NetlistInfo<AnalogComponent> | undefined;
    if (!info)
        return;
    return (info(comp));
}
