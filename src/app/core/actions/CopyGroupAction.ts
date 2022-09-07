import type {Action}          from "core/actions/Action";
import type {CircuitDesigner} from "core/models/CircuitDesigner";
import type {IOObject}        from "core/models/IOObject";
import type {IOObjectSet}     from "core/utils/ComponentUtils";
import type {Transform}       from "math/Transform";

import {CopyGroup} from "core/utils/ComponentUtils";


// TODO: Change this terribleness
export class CopyGroupAction implements Action {
    private readonly designer: CircuitDesigner;

    private readonly copy: IOObjectSet;

    private readonly transforms: Transform[];

    public constructor(designer: CircuitDesigner, initialGroup: IOObject[]) {
        this.designer = designer;
        this.copy = CopyGroup(initialGroup);

        this.transforms = this.copy.getComponents().map((c) => c.getTransform());
    }

    public execute(): Action {
        this.designer.addGroup(this.copy);

        return this;
    }

    public undo(): Action {
        // Remove wires first
        for (const wire of this.copy.getWires())
            this.designer.removeWire(wire);

        // Remove objects
        for (const obj of this.copy.getComponents())
            this.designer.removeObject(obj);

        return this;
    }

    public getCopies(): IOObjectSet {
        return this.copy;
    }

    public getName(): string {
        return "Copy";
    }
}
