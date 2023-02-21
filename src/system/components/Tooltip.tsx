import * as React from "react";
import { createPortal } from 'react-dom';

interface ITooltipProperty extends IBaseProperty {
    Direction: 'top' | 'left' | 'buttom' | 'right';
    
}

export default (props: ITooltipProperty) => {
    let node = document.body;
    let children = props.children;

    const MainStyle:  React.CSSProperties = {
        position: "absolute",
        top: "1042px",
        left: "559px",
        willChange: "top, left",
    } ;

    const ArrowStyle = {
        top: "41px",
    };

    return createPortal(<div className="popover fade bs-popover-right show" role="tooltip" x-placement="right" style={MainStyle}>
        <div className="arrow" style={ArrowStyle}></div>
        <div className="popover-body">
            {children}
        </div>
    </div>, node);
}