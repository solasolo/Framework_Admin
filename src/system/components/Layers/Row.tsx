import * as React from 'react';
import { MakeStyle } from 'system/libs/Style';

export default (props: IBaseProperty) => {
    const RowStyle: React.CSSProperties = {
        display: "flex",
        flexWrap: "wrap",
    };

    return <div style={MakeStyle([RowStyle, props.style])}>{props.children}</div>;
};