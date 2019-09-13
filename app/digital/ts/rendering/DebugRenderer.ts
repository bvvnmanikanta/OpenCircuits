import {DEBUG_CULLBOXES,
        DEBUG_SELECTION_BOUNDS,
        IO_PORT_SELECT_RADIUS} from "digital/utils/Constants";
import {DEBUG_CULLBOX_STYLE,
        DEBUG_SELECTION_BOUNDS_STYLE} from "./Styles";

import {V} from "Vector";

import {Renderer} from "./Renderer";
import {Camera} from "math/Camera";

import {Wire} from "digital/models/ioobjects/Wire";
import {Component} from "digital/models/ioobjects/Component";

import {GetAllPorts} from "digital/utils/ComponentUtils";

import {Circle} from "./shapes/Circle";
import {Rectangle} from "./shapes/Rectangle";

export const DebugRenderer = (() => {
    return {
        render(renderer: Renderer, camera: Camera, objects: Array<Component>, wires: Array<Wire>): void {

            if (DEBUG_CULLBOXES) {
                const cullboxes = objects.map((c) => c.getCullBox()).concat(wires.map((w) => w.getCullBox()));
                renderer.save();
                for (const cullBox of cullboxes) {
                    renderer.transform(camera, cullBox);
                    renderer.draw(new Rectangle(V(0,0), cullBox.getSize()), DEBUG_CULLBOX_STYLE, 0.5);
                }
                renderer.restore();
            }

            if (DEBUG_SELECTION_BOUNDS) {
                const ports = GetAllPorts(objects);
                renderer.save();
                for (const port of ports) {
                    const v = port.getTargetPos();
                    renderer.transform(camera, port.getParent().getTransform());
                    renderer.draw(new Circle(v, IO_PORT_SELECT_RADIUS), DEBUG_SELECTION_BOUNDS_STYLE, 0.5);
                }
                renderer.restore();
            }

        }
    };
})();
