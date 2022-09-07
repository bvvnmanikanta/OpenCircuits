import type {DefaultTool}        from "core/tools/DefaultTool";
import type {Tool}               from "core/tools/Tool";
import type {DigitalCircuitInfo} from "digital/utils/DigitalCircuitInfo";
import type {RefObject}          from "react";
import type {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";
import type {AppStore}           from "site/digital/state";

import {CreateInfo}                   from "./CreateInfo";
import {GetDigitalCircuitInfoHelpers} from "./DigitalCircuitInfoHelpers";


export function Setup(store: AppStore, canvas: RefObject<HTMLCanvasElement>, defaultTool: DefaultTool,
                      ...tools: Tool[]): [DigitalCircuitInfo, CircuitInfoHelpers] {
    const info = CreateInfo(defaultTool, ...tools);

    return [info, GetDigitalCircuitInfoHelpers(store, canvas, info)];
}
