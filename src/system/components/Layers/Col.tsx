import * as React from 'react';
import { MakeStyle } from 'system/libs/Style';

interface IColProperty extends IBaseProperty {
    Align: 'left' | 'center' | 'right'
}

export default (props: IColProperty) => {
    let ColStyle: React.CSSProperties = {
        textAlign: props.Align,
    };

    if (props.Align == 'right') { 
        ColStyle.marginLeft = 'auto';
    }

    return <div style={MakeStyle([ColStyle, props.style])}>{props.children}</div>;
};