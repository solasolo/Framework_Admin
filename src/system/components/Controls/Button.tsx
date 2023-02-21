import * as React from "react";

import Styles from "../../styles/Button";

declare interface IButtonProperty extends IBaseProperty {
    Icon?: string;
    Text: string;
    Align?: string;
    Style?: string;
    Size?: string;
    onClick(): void;
}

export function Button(props: IButtonProperty) {
    const style = "btn-" + (props.Style || "primary");
    const align = props.Align ? "float-" + props.Align : "";

    let ButtonStyle = props.Size == 'sm' ? Styles.Small : {};

    let {Style, Size, Icon, Text, ...other} = props;

    return <button type="button" className={`btn ${style} ${align}`} style={ButtonStyle} onClick={props.onClick} {...other} >
        <i className="material-icons">{Icon}</i>&nbsp;{Text}
    </button>;
}

export function FlatButton(props: IButtonProperty) {
    const style = "btn-outline-" + (props.Style || "primary");
    const align = props.Align ? "float-" + props.Align : "";

    let ButtonStyle = props?.Size == 'sm' ? Styles.Small : {};

    let {Style, Size, Icon, Text, ...other} = props;

    return <button type="button" className={`btn ${style} ${align}`} style={ButtonStyle} onClick={props.onClick} {...other} >
        <i className="material-icons">{Icon}</i>&nbsp;{Text}
    </button>;
}

