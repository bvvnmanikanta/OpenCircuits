import {V} from "Vector";

import {Camera} from "math/Camera";

import {RenderQueue}       from "core/utils/RenderQueue";
import {SelectionsWrapper} from "core/utils/SelectionsWrapper";

import {HistoryManager} from "core/actions/HistoryManager";

import {DefaultTool}      from "core/tools/DefaultTool";
import {PanTool}          from "core/tools/PanTool";
import {RotateTool}       from "core/tools/RotateTool";
import {SelectionBoxTool} from "core/tools/SelectionBoxTool";
import {SplitWireTool}    from "core/tools/SplitWireTool";
import {Tool}             from "core/tools/Tool";
import {ToolManager}      from "core/tools/ToolManager";
import {TranslateTool}    from "core/tools/TranslateTool";
import {WiringTool}       from "core/tools/WiringTool";

import {CleanUpHandler}       from "core/tools/handlers/CleanUpHandler";
import {DeleteHandler}        from "core/tools/handlers/DeleteHandler";
import {DeselectAllHandler}   from "core/tools/handlers/DeselectAllHandler";
import {DuplicateHandler}     from "core/tools/handlers/DuplicateHandler";
import {FitToScreenHandler}   from "core/tools/handlers/FitToScreenHandler";
import {PressableHandler}     from "core/tools/handlers/PressableHandler";
import {RedoHandler}          from "core/tools/handlers/RedoHandler";
import {SelectAllHandler}     from "core/tools/handlers/SelectAllHandler";
import {SelectionHandler}     from "core/tools/handlers/SelectionHandler";
import {SelectPathHandler}    from "core/tools/handlers/SelectPathHandler";
import {SnipWirePortsHandler} from "core/tools/handlers/SnipWirePortsHandler";
import {UndoHandler}          from "core/tools/handlers/UndoHandler";

import {DefaultCircuit} from "core/models/Circuit";

import {DigitalObj} from "core/models/types/digital";

import {DigitalCircuitInfo} from "digital/utils/DigitalCircuitInfo";

import {DigitalSim} from "digital/models/sim/DigitalSim";

import {CircuitController}     from "core/controllers/CircuitController";
import {PropagationController} from "digital/controllers/PropagationController";

import {FakeInput} from "./FakeInput";


export function GetDefaultTools() {
    return {
        defaultTool: new DefaultTool(
            SelectAllHandler, FitToScreenHandler, DuplicateHandler,
            DeleteHandler, SnipWirePortsHandler, DeselectAllHandler,
            PressableHandler, SelectionHandler, SelectPathHandler,
            RedoHandler, UndoHandler, CleanUpHandler,
        ),
        tools: [PanTool, RotateTool, TranslateTool,
                WiringTool, SplitWireTool, SelectionBoxTool],
    };
}


type Props = {
    propagationTime?: number;
    screenSize?: [number, number];
    tools?: {
        defaultTool: DefaultTool;
        tools?: Tool[];
    };
}
/**
 * This function generates basic objects usefule when testing.
 *
 * @param props - Optional parameters to pass in.
 * @returns     Everything in DigitalCircuitInfo except "input", a fake input, and a reset function.
 */
export function Setup(props?: Props): Omit<DigitalCircuitInfo, "input" | "viewManager"> &
                                      {input: FakeInput, reset: (d?: boolean) => void} {
    const propagationTime = props?.propagationTime ?? 0;
    const screenSize = props?.screenSize ?? [500, 500];
    const tools = props?.tools ?? GetDefaultTools();

    const camera = new Camera(...screenSize);
    const history = new HistoryManager();
    const circuit = new CircuitController<DigitalObj>(DefaultCircuit(), "DigitalWire", "DigitalNode");
    const sim = new DigitalSim(circuit);
    const propagationController = new PropagationController(-1, sim);
    const selections = new SelectionsWrapper();
    const renderer = new RenderQueue();
    const toolManager = new ToolManager(tools.defaultTool, ...tools.tools!);
    const input = new FakeInput(camera);

    const info = {
        locked: false,
        history,
        camera,
        circuit,
        sim,
        propagationController,
        input,
        selections,
        toolManager,
        renderer,

        debugOptions: {
            debugCullboxes:       false,
            debugPressableBounds: false,
            debugSelectionBounds: false,
            debugNoFill:          false,
        },

        // Utility function to reset the state of the CircuitInfo
        reset: (resetDesigner = false) => {
            history.reset();
            camera.setPos(V()); camera.setZoom(0.02); // Reset camera
            if (resetDesigner)
                circuit.reset();
            input.reset();
            selections.get().forEach((s) => selections.deselect(s)); // Reset selections
            // @TODO
            toolManager.reset(info as any);
        },
    };

    // @TODO
    // input.subscribe((ev) => toolManager.onEvent(ev, info));

    return info;
}
