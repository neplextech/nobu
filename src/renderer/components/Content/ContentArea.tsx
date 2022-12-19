interface IProps {
    tab: NobuDispatchedTab;
    split: NobuSplitView[] | null;
}

export function ContentArea(props: IProps) {
    const { split, tab } = props;

    return <div></div>;
}
