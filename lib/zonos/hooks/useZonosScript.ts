import { useContext } from "react";

import { ZonosScriptContext } from "components/zonos/ZonosScriptContext";

export const useZonosScript = () => useContext(ZonosScriptContext);
