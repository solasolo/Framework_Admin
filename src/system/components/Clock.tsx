import * as React from 'react';
import { useTimer } from '../libs/Hooks';
import DateTime from '../libs/DateTime';
import Frame from "../styles/Frame"
import { MakeStyle } from 'system/libs/Style';

export default (props: IBaseProperty) => {
    let [Clock, setClock] = React.useState("");

    useTimer(() => {
        setClock(DateTime.DateTimeString());
    }, 1000);

    return <div style={Frame.Small}>{Clock}</div>;
}