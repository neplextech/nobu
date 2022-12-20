import { createContext } from "react";

interface INobuTabContextData {
    current: NobuDispatchedTab;
    tabs: NobuDispatchedTab[];
}

export const NobuTabContext = createContext<INobuTabContextData>({
    current: null as unknown as NobuDispatchedTab,
    tabs: []
});
