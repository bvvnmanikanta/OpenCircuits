import type {CircuitInfo} from "core/utils/CircuitInfo";
import type {Event}       from "core/utils/Events";

import {GroupAction} from "core/actions/GroupAction";

import {CreateGroupSnipAction} from "core/actions/addition/SplitWireAction";

import {CreateDeselectAllAction} from "core/actions/selection/SelectAction";

import type {Node} from "core/models";
import {isNode}    from "core/models";

import type {EventHandler} from "../EventHandler";


export const SnipWirePortsHandler: EventHandler = ({
    conditions: (event: Event, { selections }: CircuitInfo) =>
        (event.type === "keydown" &&
         event.key === "x" &&
         selections.amount() > 0 &&
         selections.all((o) => isNode(o))),

    getResponse: ({ history, designer, selections }: CircuitInfo) => {
        const ports = selections.get().filter((o) => isNode(o)) as Node[];

        // Deselect the ports and then snip them
        history.add(new GroupAction([
            CreateDeselectAllAction(selections).execute(),
            CreateGroupSnipAction(designer, ports), // Implicitly executed automatically
        ], "Snip Wire Ports Handler"));
    },
});
