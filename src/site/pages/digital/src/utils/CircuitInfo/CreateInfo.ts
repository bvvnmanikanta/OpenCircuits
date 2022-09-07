import type {DefaultTool}        from "core/tools/DefaultTool";
import type {Tool}               from "core/tools/Tool";
import type {Input}              from "core/utils/Input";
import type {DigitalCircuitInfo} from "digital/utils/DigitalCircuitInfo";

import {Camera} from "math/Camera";

import {RenderQueue}       from "core/utils/RenderQueue";
import {SelectionsWrapper} from "core/utils/SelectionsWrapper";

import {HistoryManager} from "core/actions/HistoryManager";

import {ToolManager} from "core/tools/ToolManager";

import {DigitalCircuitDesigner} from "digital/models";


export function CreateInfo(defaultTool: DefaultTool, ...tools: Tool[]): DigitalCircuitInfo {
    const camera = new Camera();
    const history = new HistoryManager();
    const designer = new DigitalCircuitDesigner(1);
    const selections = new SelectionsWrapper();
    const renderer = new RenderQueue();
    const toolManager = new ToolManager(defaultTool, ...tools);

    const info: DigitalCircuitInfo = {
        locked: false,
        history,
        camera,
        designer,

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
