import { useEffect, useState } from "react";

interface IProps {
    address?: string;
    onSubmit: (address: string) => void;
}

export function AddressBar(props: IProps) {
    const { address, onSubmit } = props;
    const [currentAddress, setCurrentAddress] = useState(address || "");

    useEffect(() => {
        setCurrentAddress(address || "");
    }, [address]);

    return (
        <input
            type="text"
            placeholder="Search or enter web address"
            className="w-full dark:bg-xdark bg-xlight p-1 px-5 rounded-full focus:outline dark:focus:outline-gray-500 focus:outline-gray-300"
            onKeyUp={(e) => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    if (e.currentTarget.value) {
                        onSubmit(currentAddress);
                    }
                }
            }}
            autoCorrect="false"
            autoCapitalize="false"
            autoComplete="false"
            autoFocus={false}
            autoSave="false"
            value={currentAddress}
            onChange={(e) => {
                setCurrentAddress(e.currentTarget.value);
            }}
        />
    );
}
