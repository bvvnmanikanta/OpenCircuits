import type {CircuitInfo} from "core/utils/CircuitInfo";
import type {Event}       from "core/utils/Events";

import type {EventHandler} from "../EventHandler";


export const SaveHandler = (save: () => void): EventHandler => ({
    conditions: (event: Event, { input }: CircuitInfo) =>
        (event.type === "keydown" && event.key === "s" && input.isModifierKeyDown()),

    getResponse: () => {
        save();
    },
});
