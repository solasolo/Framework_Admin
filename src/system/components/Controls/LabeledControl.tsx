import * as React from "react";

interface ILabeledControlProperty extends IBaseProperty {
    Title: string;
    InLine?: boolean;
    Style?: any;
}

export default (props: ILabeledControlProperty) => {
    let inline = props.InLine || false;
    let LabelClass = inline ? "input-group-prepend" : "control-label";

    /*
    let InputControl = inline ?
        <div className="col-sm-10" style={props.Style}>
            {props.children}
        </div>
        : props.children;
    */

    let InputControl = props.children;

    return <div className={inline ? "control-group" : "form-group"}>
        <label className={LabelClass}>
            {props.Title}
        </label>
        {InputControl}
    </div>;
};