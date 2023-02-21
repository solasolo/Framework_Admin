import * as React from 'react';
import Color from 'system/styles/Color';

declare interface ICardProperty extends IBaseProperty {
    Width?: string;
    Height?: string;
}

declare interface ICardTitleProperty extends IBaseProperty {
    Color?: string;
}

export function Card(props: ICardProperty) {
    const style: any = {};

    style.width = props.Width ?? "18rem";
    props.Height && (style.height = props.Height);

    return <div className="card" style={style}>
        <div className="card-body">
            {props.children}
        </div>
    </div>;
}

export function CardTitle(props: ICardTitleProperty) {
    let color = props.Color ?? "black";

    return <h5 className="card-title bg-light" style={{ color: props.Color }}>{props.children}</h5>;
}

export function CardAction(props: IBaseProperty) {
    return <div className="card-actions float-right">{props.children}</div>;
}
