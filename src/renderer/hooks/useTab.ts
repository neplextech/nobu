import { useContext } from "react";
import { NobuTabContext } from "../context/TabContext";

export function useTab() {
    const res = useContext(NobuTabContext);

    return {
        current: res.current || res.tabs[0],
        tabs: res.tabs
    };
}
