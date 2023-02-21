import * as React from "react";

interface IIfProperty extends IBaseProperty {
    Condition: boolean;
}

export default (props: IIfProperty) => {
    let content = props.Condition ? props.children : null;

    return <>
        {content}
    </>;
}