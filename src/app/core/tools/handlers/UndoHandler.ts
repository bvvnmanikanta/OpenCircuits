import type {CircuitInfo} from "core/utils/CircuitInfo";
import type {Event}       from "core/utils/Events";

import type {EventHandler} from "../EventHandler";


export const UndoHandler: EventHandler = ({
    conditions: (event: Event, { input }: CircuitInfo) =>
        (event.type === "keydown" && event.key === "z" && input.isModifierKeyDown()),

    getResponse: ({ history }: CircuitInfo) => history.undo(),
});
