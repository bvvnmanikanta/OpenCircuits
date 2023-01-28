import {useEffect} from "react";

import {useMainCircuit}                       from "shared/utils/hooks/useCircuit";
import {useSharedDispatch, useSharedSelector} from "shared/utils/hooks/useShared";

import {ToggleDebugCullboxes, ToggleDebugNoFill,
        ToggleDebugPressableBounds, ToggleDebugSelectionBounds} from "shared/state/DebugInfo";
import {CloseHeaderMenus, OpenHeaderMenu} from "shared/state/Header";

import {SwitchToggle} from "shared/components/SwitchToggle";

import {Dropdown} from "../Dropdown";

import {AutoSaveToggle} from "./AutoSaveToggle";


export const SettingsMenu = () => {
    const circuit = useMainCircuit();
    const { curMenu, debugInfo } = useSharedSelector(
        (state) => ({ curMenu: state.header.curMenu, debugInfo: state.debugInfo })
    );
    const dispatch = useSharedDispatch();

    // We need this to connect the Redux state to the CircuitInfo state
    // (keeps CircuitInfo in sync with the Redux state)
    useEffect(() => {
        circuit.debugOptions = debugInfo;
    }, [circuit, debugInfo, debugInfo.debugCullboxes, debugInfo.debugPressableBounds,
        debugInfo.debugSelectionBounds, debugInfo.debugNoFill]); // Updates when any of the debugInfo values change

    return (
        <Dropdown open={(curMenu === "settings")}
                  btnInfo={{ title: "User Settings", src: "img/icons/settings.svg" }}
                  onClick={() => dispatch(OpenHeaderMenu("settings"))}
                  onClose={() => dispatch(CloseHeaderMenus())}>
            <AutoSaveToggle />
            {process.env.NODE_ENV === "development" &&
                (<>
                    <h1>Debug</h1>
                    <hr />
                    <SwitchToggle
                        isOn={debugInfo.debugCullboxes}
                        onChange={() => dispatch(ToggleDebugCullboxes())}>
                        Debug Cullboxes : {debugInfo.debugCullboxes ? "On" : "Off"}
                    </SwitchToggle>
                    <SwitchToggle
                        isOn={debugInfo.debugPressableBounds}
                        onChange={() => dispatch(ToggleDebugPressableBounds())}>
                        Debug Pressable Bounds : {debugInfo.debugPressableBounds ? "On" : "Off"}
                    </SwitchToggle>
                    <SwitchToggle
                        isOn={debugInfo.debugSelectionBounds}
                        onChange={() => dispatch(ToggleDebugSelectionBounds())}>
                        Debug Selection Bounds : {debugInfo.debugSelectionBounds ? "On" : "Off"}
                    </SwitchToggle>
                    <SwitchToggle
                        isOn={debugInfo.debugNoFill}
                        onChange={() => dispatch(ToggleDebugNoFill())}>
                        Debug No Fill : {debugInfo.debugNoFill ? "On" : "Off"}
                    </SwitchToggle>
                </>)}
        </Dropdown>
    );
}
