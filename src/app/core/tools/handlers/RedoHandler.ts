import type {EventHandler} from "../EventHandler";
import type {CircuitInfo}  from "core/utils/CircuitInfo";
import type {Event}        from "core/utils/Events";


export const RedoHandler: EventHandler = ({
    conditions: (event: Event, { input }: CircuitInfo) =>
        (event.type === "keydown" &&
         (event.key === "z" && input.isModifierKeyDown() && input.isShiftKeyDown() ||
          event.key === "y" && input.isModifierKeyDown())),

    getResponse: ({ history }: CircuitInfo) => history.redo(),
});
