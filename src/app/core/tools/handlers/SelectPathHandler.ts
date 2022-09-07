import type {EventHandler} from "../EventHandler";
import type {Component}    from "core/models";
import type {CircuitInfo}  from "core/utils/CircuitInfo";
import type {Event}        from "core/utils/Events";

import {LEFT_MOUSE_BUTTON} from "core/utils/Constants";

import {GetComponentPath, GetPath} from "core/utils/ComponentUtils";

import {CreateGroupSelectAction} from "core/actions/selection/SelectAction";

import {Wire} from "core/models";


export const SelectPathHandler: EventHandler = ({
    conditions: (event: Event, { input, camera, designer }: CircuitInfo) =>
        (event.type === "dblclick" &&
         event.button === LEFT_MOUSE_BUTTON &&
         designer // is there a wire or component within select bounds?
           .getAll()
           .some((o) => o.isWithinSelectBounds(camera.getWorldPos(input.getMousePos())))
        ),

    getResponse: ({ input, camera, history, designer, selections }: CircuitInfo) => {
        const worldMousePos = camera.getWorldPos(input.getMousePos());

        const obj = designer
            .getAll()
            .reverse()
            .find((o) =>
                o.isWithinSelectBounds(worldMousePos)) as Component | Wire;

        const path = (obj instanceof Wire) ? (GetPath(obj)) : (GetComponentPath(obj!));
        history.add(CreateGroupSelectAction(selections, path).execute());
    },
});
