import * as React from "react";

interface ITabsProperty extends IBaseProperty {
    List: any;
    Color?: string;
    onChange?(key: string): void;
}

interface ITabsState {
    Current: string;
}

export default (props: ITabsProperty) => {
    let [Current, setCurrent] = React.useState("");

    let lst = props.List;
    let options: any[] = [];

    if (lst) {
        const current = Current;

        options = Object.keys(lst).map((key, index) => {
            let tab;
            let cls = { cursor: "pointer" };

            if (current === key || (index == 0 && !current)) {
                tab = <li
                    className="nav-item"
                    style={cls}
                    key={key}>
                    <a className="nav-link active">{lst[key]}</a></li>;
            } else {
                tab = <li
                    className="nav-item"
                    style={cls}
                    key={key}
                    onClick={() => {
                        setCurrent(key);

                        if (props.onChange) {
                            props.onChange(key);
                        }
                    }}>
                    <a className="nav-link">{lst[key]}</a></li>;
            }

            return tab;
        });
    }

    let color = props.Color || "danger";

    return <ul className="nav nav-pills nav-pills-primary" role="tablist">
        {options}
    </ul>;
}

