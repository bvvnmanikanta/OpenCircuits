import {Rect} from "math/Rect";

import {Prop} from "../../schema/Prop";


export interface BaseObject {
    readonly kind: string;
    readonly id: string;
    readonly bounds: Rect;

    isSelected: boolean;
    zIndex: number;

    exists(): boolean;

    setProp(key: string, val: Prop): void;
    getProp(key: string): Prop;
    getProps(): Record<string, Prop>;
}
