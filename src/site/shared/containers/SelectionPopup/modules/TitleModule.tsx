import {useCallback, useEffect, useState} from "react";

import {CircuitInfo} from "core/utils/CircuitInfo";

import {GroupAction} from "core/actions/GroupAction";

import {SetProperty} from "core/actions/units/SetProperty";

import {TextModuleInputField} from "./inputs/TextModuleInputField";
// import {useSelectionProps}    from "./useSelectionProps";


type Props = {
    info: CircuitInfo;
}
export const TitleModule = ({ info }: Props) => {
    const { circuit, selections, renderer, history } = info;

    const [names, setNames] = useState([] as string[]);

    const updateState = useCallback(() => {
        setNames(
            info.selections.get()
                .map((id) => info.circuit.getObj(id)!)
                .map((o) => (o.name ?? o.kind))
        );
    }, [info]);

    useEffect(() => {
        info.history.addCallback(updateState);
        info.selections.subscribe(updateState);

        return () => {
            info.history.removeCallback(updateState);
            info.selections.unsubscribe(updateState);
        }
    }, [info, updateState]);
    // const [props] = useSelectionProps(
    //     info,
    //     (s): s is Selectable => true,
    //     (s) => ({ name: s.getName() })
    // );

    if (names.length === 0)
        return null;

    const s = selections.get();

    return (<div>
        <label>
            <TextModuleInputField
                props={names}
                placeholder="<Multiple>"
                alt="Name of object(s)"
                getAction={(newNames) => new GroupAction(
                    s.map((id, i) => SetProperty(circuit, id, "name", newNames[i])),
                    "Title Module"
                )}
                onSubmit={({ isFinal, action }) => {
                    renderer.render();
                    if (isFinal)
                        history.add(action);
                }} />
        </label>
    </div>)
}
