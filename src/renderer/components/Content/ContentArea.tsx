import { useTab } from "../../hooks/useTab";
import { MultiView } from "../MultiView/MultiView";
import { BrowserSettings } from "../../pages/BrowserSettings";
import { MultiViewPage } from "../../pages/MultiViewPage";
import { MultiViewSettings } from "../../pages/MultiViewSettings";

interface IProps {
    tab: NobuDispatchedTab;
    split: (NobuSplitView & { tabId: string })[];
}

export function ContentArea(props: IProps) {
    const { split = [], tab } = props;

    if (tab.virtual && tab.page) {
        switch (tab.page) {
            case "multiview-settings":
                return <MultiViewSettings />;
            case "settings":
                return <BrowserSettings />;
            default:
                return <></>;
        }
    }

    if (split.length) return <MultiViewPage split={split} tab={tab} />;

    return <></>;
}
