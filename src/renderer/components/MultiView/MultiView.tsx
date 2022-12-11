import { WebView } from "./WebView";

interface IProps {
    pages: WebViewModeConfig[];
}

export function MultiView(props: IProps) {
    const { pages } = props;

    return (
        <div className="overflow-auto">
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
    );
}
