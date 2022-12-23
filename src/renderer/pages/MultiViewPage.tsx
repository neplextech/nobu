import { useTab } from "../hooks/useTab";
import { MultiView } from "../components/MultiView/MultiView";

interface IProps {
    tab: NobuDispatchedTab;
    split: (NobuSplitView & { tabId: string })[];
}

export function MultiViewPage(props: IProps) {
    const { current } = useTab();
    const { split, tab } = props;
    const phones = split.filter((r) => r.type === "mobile");
    const tabs = split.filter((r) => r.type === "tablet");

    if (current?.id === tab.id && split.length)
        return (
            <div className="flex flex-col space-y-4 overflow-y-auto w-full dark:text-white light:text-black">
                <h1 className="text-center text-2xl">Multi-View Mode</h1>
                {phones.length ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-medium">Mobiles</h1>
                        <MultiView pages={phones} phone />
                    </div>
                ) : null}

                {tabs.length ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-medium">Tablets</h1>
                        <MultiView pages={tabs} />
                    </div>
                ) : null}
            </div>
        );

    return <></>;
}
