import {GUID}       from "core/utils/GUID";
import {Observable} from "core/utils/Observable";

import {DigitalComponent, DigitalObj, DigitalPort} from "core/models/types/digital";

import {Signal} from "digital/models/sim/Signal";

import {DigitalCircuitController} from "digital/controllers/DigitalCircuitController";

import {Propagate} from "./Propagators";


type PropagationEvent = {};

export class PropagationManager extends Observable<PropagationEvent> {
    private readonly circuit: DigitalCircuitController;

    // Map of every port in the circuit to its associated signal.
    private readonly signals: Map<GUID, Signal>;

    // States for each component, needed for things like FlipFlops which store a signal as a state.
    private readonly states: Map<GUID, unknown>;

    // Propagation is IDs of components to propagate a signal through.
    private readonly propagationQueue: Set<GUID>;

    public constructor(circuit: DigitalCircuitController) {
        super();

        this.circuit = circuit;
        this.signals = new Map();
        this.states = new Map();
        this.propagationQueue = new Set();
    }

    private setSignal(port: DigitalPort, signal: Signal): void {
        this.signals.set(port.id, signal);

        // Find connections and add them to propagation queue
        const wires = this.circuit.getWiresFor(port);
        const ports = wires.map((w) => {
            const [p1, p2] = this.circuit.getPortsForWire(w);
            return ((p1 === port) ? (p2) : (p1));
        });
        ports.forEach((p) => this.propagationQueue.add(p.parent));
    }

    private setState(comp: DigitalComponent, state: unknown): void {
        this.states.set(comp.id, state);

        // If state changed, update the component
        this.propagationQueue.add(comp.id);
    }

    public onAddObj(m: DigitalObj) {
        if (m.baseKind === "Port") {
            // @TODO: might need someway to get initial state?
            this.signals.set(m.id, Signal.Off);

            // Add to propagation queue (@TODO: might need to callback this event / move to method)
            this.propagationQueue.add(m.parent);
        }
    }

    // @TODO: might need onEditObj, for instance, if a Port is changed to a `not` port

    public onRemoveObj(m: DigitalObj) {
        if (m.baseKind === "Port") {
            this.signals.delete(m.id);

            // Queue parent for propagation
            this.propagationQueue.add(m.parent);
        }
        if (m.baseKind === "Component") {
            this.states.delete(m.id);

            // Remove from propagation queue if we're deleting it
            this.propagationQueue.delete(m.id);
        }
    }

    public step(): void {
        const comps = [...this.propagationQueue].map((id) => this.circuit.getObj(id)) as DigitalComponent[];

        // Clear the queue
        this.propagationQueue.clear();

        // Copy current signals and states
        const curSignals = new Map(this.signals);
        const curStates = new Map(this.states);

        for (const comp of comps) {
            // Group every port by their group and sort by their index
            const ports = this.circuit.getPortsFor(comp);
            const groupedPorts = new Array(3).fill(0) // TODO: Maybe don't hardcode the `3`, use max-group
                .map((_, g) => ports.filter((p) => (p.group === g)).sort((a, b) => (a.index - b.index)));

            // And then get associated signals and state
            const groupedSignals = groupedPorts.map((g) => g.map((p) => curSignals.get(p.id)!));
            const state = curStates.get(comp.id);

            const { nextSignals, nextState } = Propagate(comp, groupedSignals, state);

            // Update signals
            nextSignals.forEach((group, g) => (
                group.forEach((nextSignal, i) => {
                    // Get associated port with new signal
                    const port = groupedPorts[g][i];

                    // If signal is the same, don't do anything
                    if (curSignals.get(port.id) === nextSignal)
                        return;

                    this.setSignal(port, nextSignal);
                })
            ));

            // Update state if it changed
            if (nextState !== state)
                this.setState(comp, nextState);
        }

        this.publish({});
    }
}