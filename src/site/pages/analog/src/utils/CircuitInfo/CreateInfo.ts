import type {NGSpiceLib}        from "analog/models/sim/lib/NGSpiceLib";
import type {AnalogCircuitInfo} from "analog/utils/AnalogCircuitInfo";
import type {DefaultTool}       from "core/tools/DefaultTool";
import type {Tool}              from "core/tools/Tool";
import type {Input}             from "core/utils/Input";

import {Camera} from "math/Camera";

import {RenderQueue}       from "core/utils/RenderQueue";
import {SelectionsWrapper} from "core/utils/SelectionsWrapper";

import {HistoryManager} from "core/actions/HistoryManager";

import {ToolManager} from "core/tools/ToolManager";

import {AnalogCircuitDesigner} from "analog/models";

import {AnalogSim} from "analog/models/sim/AnalogSim";


export function CreateInfo(ngSpiceLib: NGSpiceLib | undefined,
                           defaultTool: DefaultTool, ...tools: Tool[]): AnalogCircuitInfo {
    const camera = new Camera();
    const history = new HistoryManager();
    const designer = new AnalogCircuitDesigner();
    const selections = new SelectionsWrapper();
    const renderer = new RenderQueue();
    const toolManager = new ToolManager(defaultTool, ...tools);

    const sim = (ngSpiceLib ? new AnalogSim(ngSpiceLib) : undefined);

    const info: AnalogCircuitInfo = {
        locked: false,
        history,
        camera,
        designer,
        sim,

        // This is necessary because input is created later in the pipeline because it requires canvas
        input: undefined as unknown as Input,
        selections,
        toolManager,
        renderer,

        debugOptions: {
            debugCullboxes:       false,
            debugPressableBounds: false,
            debugSelectionBounds: false,
            debugNoFill:          false,
        },
    };

    return info;
}
