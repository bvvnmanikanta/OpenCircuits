import {DEFAULT_FILL_COLOR,
        DEFAULT_BORDER_COLOR,
        SELECTED_FILL_COLOR,
        SELECTED_BORDER_COLOR,
        IO_PORT_LINE_WIDTH,
        IO_PORT_RADIUS,
        IO_PORT_BORDER_WIDTH} from "digital/utils/Constants";

import {Renderer} from "../Renderer";
import {Port} from "digital/models/ports/Port";

import {Circle} from "../shapes/Circle";
import {Line} from "../shapes/Line";
import {Style} from "../Style";

export const IOPortRenderer = (() => {
    return {
        renderPort(renderer: Renderer, port: Port, selected: boolean, portSelected: boolean): void {
            const o = port.getOriginPos();
            const v = port.getTargetPos();

            const lineCol = (selected && !portSelected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
            const lineStyle = new Style(undefined, lineCol, IO_PORT_LINE_WIDTH);

            renderer.draw(new Line(o, v), lineStyle);

            const borderCol = (selected || portSelected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
            const circleFillCol = (selected || portSelected ? SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR);
            const circleStyle = new Style(circleFillCol, borderCol, IO_PORT_BORDER_WIDTH)

            renderer.draw(new Circle(v, IO_PORT_RADIUS), circleStyle);
        }
    };
})();
