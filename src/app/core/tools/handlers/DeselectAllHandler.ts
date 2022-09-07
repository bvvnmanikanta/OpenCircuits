import type {CircuitInfo} from "core/utils/CircuitInfo";
import type {Event}       from "core/utils/Events";

import {CreateDeselectAllAction} from "core/actions/selection/SelectAction";

import type {EventHandler} from "../EventHandler";


export const DeselectAllHandler: EventHandler = ({
    conditions: (event: Event, { selections }: CircuitInfo) =>
        (event.type === "keydown" &&
         event.key === "Escape" &&
         selections.amount() > 0),

    getResponse: ({ history, selections }: CircuitInfo) =>
        history.add(CreateDeselectAllAction(selections).execute()),
});
