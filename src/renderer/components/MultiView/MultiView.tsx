import { WebView } from "./WebView";

interface IProps {
    pages: WebViewModeConfig[];
}

export function MultiView(props: IProps) {
    const { pages } = props;

    return (
        <div className="overflow-auto">
            <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2">
                {pages.map((m, i) => {
                    return (
                        <WebView
                            src={m.url}
                            style={{
                                width: m.width,
                                height: m.height
                            }}
                            key={i}
                        ></WebView>
                    );
                })}
            </div>
        </div>
    );
}
