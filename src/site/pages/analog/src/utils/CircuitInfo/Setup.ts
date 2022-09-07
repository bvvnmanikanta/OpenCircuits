import type {NGSpiceLib}         from "analog/models/sim/lib/NGSpiceLib";
import type {AnalogCircuitInfo}  from "analog/utils/AnalogCircuitInfo";
import type {DefaultTool}        from "core/tools/DefaultTool";
import type {Tool}               from "core/tools/Tool";
import type {RefObject}          from "react";
import type {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";
import type {AppStore}           from "site/analog/state";

import {GetAnalogCircuitInfoHelpers} from "./AnalogCircuitInfoHelpers";
import {CreateInfo}                  from "./CreateInfo";


export function Setup(store: AppStore, canvas: RefObject<HTMLCanvasElement>, ngSpiceLib: NGSpiceLib,
                      defaultTool: DefaultTool, ...tools: Tool[]): [AnalogCircuitInfo, CircuitInfoHelpers] {
    const info = CreateInfo(ngSpiceLib, defaultTool, ...tools);
    return [info, GetAnalogCircuitInfoHelpers(store, canvas, info)];
}
