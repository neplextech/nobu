import { useEffect, useState } from "react";
import { receiver } from "../../utils/nobu";

interface IProps {
    current: NobuDispatchedTab;
    onSubmit: (address: string) => void;
}

export function AddressBar(props: IProps) {
    const { onSubmit, current } = props;
    const [currentAddress, setCurrentAddress] = useState(current.url || "");

    useEffect(() => {
        setCurrentAddress(current.url || "");
    }, [current.url]);

    useEffect(() => {
        const addrL = receiver("set-url", (_, id, url) => {
            if (id === current.id) setCurrentAddress(url || "");
        });

        return () => addrL.destroy();
    }, []);

    return (
        <input
            type="text"
            placeholder="Search or enter web address"
            className={`w-full ${
                current.virtual ? "cursor-not-allowed" : ""
            } dark:bg-xdark bg-xlight p-1 px-5 rounded-full focus:outline dark:focus:outline-gray-500 focus:outline-gray-300`}
            onKeyUp={(e) => {
                if (current.virtual) return e.preventDefault();
                if (e.keyCode === 13) {
                    e.preventDefault();
                    if (e.currentTarget.value) {
                        onSubmit(currentAddress);
                    }
                }
            }}
            disabled={!!current.virtual}
            autoCorrect="false"
            autoCapitalize="false"
            autoComplete="false"
            autoFocus={false}
            autoSave="false"
            value={currentAddress}
            onChange={(e) => {
                if (current.virtual) return e.preventDefault();
                setCurrentAddress(e.currentTarget.value);
            }}
        />
    );
}
