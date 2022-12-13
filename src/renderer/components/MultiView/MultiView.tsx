import { WebView } from "./WebView";

interface IProps {
    pages: WebViewModeConfig[];
    phone?: boolean;
}

export function MultiView(props: IProps) {
    const { pages, phone } = props;

    return (
        <div className="overflow-auto mb-[70px]">
            <div className={`grid ${phone ? "lg:grid-cols-3 grid-cols-1" : "grid-cols-1"} gap-2`}>
                {pages.map((m, i) => {
                    return (
                        <div>
                            <h1>
                                {m.name || `Screen-${++i}`} | ({m.height}x{m.width})
                            </h1>
                            <WebView
                                src={m.url}
                                style={{
                                    width: m.cw,
                                    height: m.ch
                                }}
                                key={i}
                                useragent={m.userAgent || undefined}
                                className="border dark:border-gray-500 border-gray-300 bg-slate-300"
                            ></WebView>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
