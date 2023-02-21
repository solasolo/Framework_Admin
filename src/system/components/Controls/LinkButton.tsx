import * as React from "react";
import Utils from "../../libs/Utils";

declare interface ILinkButtonProperty extends IBaseProperty {
    Icon?: string;
    Style?: string;
    Align?: string;
    Size?: string;
    Hint?: string;
    onClick(): void;
}

const ButtonCss = {
    margin: "3px",
};

export default (props: ILinkButtonProperty) => {
    function Click() {
        Utils.PromiseInvoke(props.onClick, null, () => {
            // TODO
        });
    }

    let type = "btn-" + (props.Style || "primary");
    let size = "";
    if (props.Size) {
        size = "btn-" + props.Size;
    }

    return <a data-toggle="tooltip" title={props.Hint} className={`btn ${type} ${size}`} style={ButtonCss} onClick={() => { Click(); }}>
        {props.children}
    </a>;
};
