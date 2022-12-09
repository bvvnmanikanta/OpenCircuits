---
title: Adding new Components
---

Most components have at least two SVG files to display. One of these is the one shown in the item navigation bar where you drag components from, and the other(s) are shown on the canvas when dragged and dropped.


## Itemnav SVG file
The itemnav SVG looks like this:
```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30">
<path d=" INPUT PATH HERE "
stroke="black" stroke-width="1" stroke-linecap="round" fill="none"></path>
</svg>
```

I like to use [this editor/viewer from rapidtables](https://www.rapidtables.com/web/tools/svg-viewer-editor.html) because it is straightforward unlike a lot of other SVG editors out there. Copy the code above into there and modify `INPUT PATH HERE` to be the actual path ([read up on paths here](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)). Some icons require more than just a path (i.e. circles and other neat shapes). You can edit these however you like, this is just some starter code.

Put your itemnav SVG file in the appropriate subdirectory in either the site/pages/digital/public/img/itemnav/ folder if your component is digital or the site/pages/analog/public/img/itemnav/ folder if it is an analog component

Additionally, you'll need to add your component in site/pages/digital/src/data/itemNavConfig.json if it is digitials or 
site/pages/analog/src/data/itemNavConfig.json if it is analog

## Canvas SVG file(s)
If your component is `Pressable`, which means you should be able to click on it to change its behavior (e.g. a switch or button), then you will need to create multiple SVG files. If not, then only one is required. These are similar to the itemnav SVG files:
```svg
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="10.5px" viewbox = "24 9.75 17 10.5">
<path d=" INPUT PATH HERE "
stroke="black" stroke-width="1" stroke-linecap="round" fill="none"></path>
</svg>
```

Your path and dimensions may vary from the itemnav tool. When in doubt, take a look at existing component SVGs as examples. The main difference here is the `viewBox` which defines the area of the icon which is to be visible. 
 Make it in site/pages/digital/public/img/items/ if it is a digitial competent or site/pages/analog/public/img/items/ if it is analog. 

## TypeScript files
First add your competent to src/app/core/models/types/digital.ts 
```typescript
export type ANDGate = Component & { kind: "ANDGate" };
export type Switch  = Component & { kind: "Switch"  };
export type LED     = Component & { kind: "LED", color: string };

export type DigitalComponent =
    | DigitalNode
    | Switch
    | LED
    | ANDGate;

export type DigitalObj = DigitalPort | DigitalWire | DigitalComponent;


export const DefaultDigitalComponent: { [C in DigitalComponent as C["kind"]]: ComponentFactory<C> } = {
    "DigitalNode": (id) => ({ ...DefaultComponent(id), kind: "DigitalNode"           }),
    "Switch":      (id) => ({ ...DefaultComponent(id), kind: "Switch"                }),
    "LED":         (id) => ({ ...DefaultComponent(id), kind: "LED", color: "#ffffff" }),
    "ANDGate":     (id) => ({ ...DefaultComponent(id), kind: "ANDGate"               }),
};
```
or src/app/core/models/types/analog.ts if it is an analog competent
```typescript
export type AnalogNode = Component & { kind: "AnalogNode" };

export type Ground = Component & { kind: "Ground" };

export type Resistor = Component & { kind: "Resistor", resistance: number };

export type AnalogComponent =
    | AnalogNode
    | Ground
    | Resistor;

export type AnalogObj = AnalogPort | AnalogWire | AnalogComponent;


export const DefaultAnalogComponent: { [C in AnalogComponent as C["kind"]]: ComponentFactory<C> } = {
    "AnalogNode": (id) => ({ ...DefaultComponent(id), kind: "AnalogNode"                 }),
    "Ground":     (id) => ({ ...DefaultComponent(id), kind: "Ground"                     }),
    "Resistor":   (id) => ({ ...DefaultComponent(id), kind: "Resistor", resistance: 1000 }),
};
```

Second add your competent to `const AllPropagators: PropagatorRecord`
in src/app/digital/models/sim/Propagators.ts with the appropriate logic.
```typescript
export const AllPropagators: PropagatorRecord = {
    "DigitalNode": ({ signals }) => [{ "outputs": signals["inputs"] }],

    // Switch has state which represents the user-defined isOn/isOff
    "Switch": ({ state = [Signal.Off] }) => [{ "outputs": state }, state],

    // LEDs don't propagate a signal
    "LED": Noprop,

    "ANDGate":  ({ signals }) => [{ "outputs": [signals["inputs"].reduce(AND)] }],
};
```
or add it to `const AllNetlistInfo: NetlistInfoRecord` in app/analog/models/sim/NetlistInfo.ts if it is an analog competent
```typescript
export const AllNetlistInfo: NetlistInfoRecord = {
    // AnalogNode is purely a user-facing component and has no effect on the actual circuit sim
    "AnalogNode": undefined,

    // Ground is a very special case so has no specified information
    "Ground": undefined,

    "Resistor": (r) => ["R", [`${r.resistance}`]],
};
```

Third add your competent to `const DigitalPortInfo` in app/core/views/portinfo/digital/index.ts
```typescript
export const DigitalPortInfo: PortInfoRecord<DigitalComponent> = {
    "DigitalNode": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "inputs":  [{ origin: V(0, 0), target: V(0, 0), dir: V(-1, 0) }],
            "outputs": [{ origin: V(0, 0), target: V(0, 0), dir: V(+1, 0) }],
        }],
    },
    "Switch": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "outputs": [{ origin: V(0.62, 0), target: V(1.32, 0), dir: V(+1, 0) }],
        }],
    },
    "LED": {
        ...DefaultDigitalPortInfo,
        PositionConfigs: [{
            "inputs": [{ origin: V(0, -0.5), target: V(0, -2), dir: V(0, -1) }],
        }],
    },
    "ANDGate": {
        ...DefaultDigitalPortInfo,
        AllowChanges: true,
        ChangeGroup:  "inputs",

        // Generate configs for 2->8 input ports
        PositionConfigs: [2,3,4,5,6,7,8].map((numInputs) => ({
            "inputs":  CalcPortPositions(numInputs, 0.5 - DEFAULT_BORDER_WIDTH/2, 1, V(-1, 0)),
            "outputs": [CalcPortPos(V(0.5, 0), V(1, 0))], // 1 output
        })),
    },
};
```
or `const AnalogPortInfo` in app/core/views/portinfo/analog/index.ts if it is an analog competent
```typescript
export const AnalogPortInfo: PortInfoRecord<AnalogComponent> = {
    "AnalogNode": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(0, 0), target: V(0, 0), dir: V(-1, 0) },
                { origin: V(0, 0), target: V(0, 0), dir: V(+1, 0) },
            ],
        }],
    },
    "Ground": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [{ origin: V(0, +0.3), target: V(0, +1), dir: V(0, +1) }],
        }],
    },
    "Resistor": {
        ...DefaultAnalogPortInfo,
        PositionConfigs: [{
            "ports": [
                { origin: V(-0.6, 0), target: V(-1.3, 0), dir: V(-1, 0) },
                { origin: V(+0.6, 0), target: V(+1.3, 0), dir: V(+1, 0) },
            ],
        }],
    },
};
```
Lastly make a veiw for your competent in app/digital/views/ or app/analog/views/ here is an example from ANDGateView.ts
```typescript
export class ANDGateView extends ComponentView<ANDGate, DigitalViewInfo> {
    public constructor(info: DigitalViewInfo, obj: ANDGate) {
        super(info, obj, V(1, 1), "and.svg");
    }

    protected override renderComponent({ renderer, selections }: RenderInfo): void {
        const selected = selections.has(this.obj.id);

        const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);

        const style = new Style(undefined, borderCol, DEFAULT_CURVE_BORDER_WIDTH);

        // Get size of model
        const size = this.transform.get().getSize();

        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;

        // Draw line to visually match input ports
        const l1 = -(inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) - DEFAULT_BORDER_WIDTH/2;
        const l2 =  (inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2;

        const s = (size.x-DEFAULT_BORDER_WIDTH)/2;
        const p1 = V(-s, l1);
        const p2 = V(-s, l2);

        renderer.draw(new Line(p1, p2), style);
    }

    public override getBounds(): Rect {
        // Get current number of inputs
        const inputs = this.circuit.getPortsFor(this.obj)
            .filter((p) => p.group === "inputs").length;
        return super.getBounds().expand(V(0, ((inputs-1)/2*(0.5 - DEFAULT_BORDER_WIDTH/2) + DEFAULT_BORDER_WIDTH/2)));
    }
}
```
## Checklist
- [ ] Itemnav SVG in itemnav folder
- [ ] Canvas SVG(s) in items folder
- [ ] Add the competent to itemNavConfig.json
- [ ] Add competent to digital.ts or analog.ts
- [ ] Add competent to Propagators.ts
- [ ] Add competent to Propinfo
- [ ] Make a veiw for your competent