import type {AuthState} from "./auth/AuthState";

import {Request} from "shared/utils/Request";


export function Ping(auth: AuthState): Promise<string> {
    return Request({
        method:  "GET",
        url:     "api/ping",
        headers: {
            "authType": auth.getType(),
            "authId":   auth.getId(),
        },
    });
}
