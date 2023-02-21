import * as React from "react";

import Styles from "../../styles/Button";

declare interface IIconButtonProperty extends IBaseProperty {
    Icon: string;
    Style?: string;
    onClick(): void;
}

export default (props: IIconButtonProperty) => {
    const style = "btn-" + (props.Style || "primary");

    let ButtonStyle = Styles.Small;
    let {Style, Icon, onClick, ...others} = props;

    return <button type="button" className={`btn btn-float ${style}`} style={ButtonStyle}  onClick={props.onClick} {...others} >
        <i className="material-icons">{props.Icon}</i>
    </button>;
};
