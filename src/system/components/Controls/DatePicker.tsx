import * as React from 'react';
import Calendar from './Calendar';
import Formater from '../../libs/Formater';
import { useState } from 'react';

interface IDatePickerProperty extends IBaseProperty {
    Name?: string;
    Date?: Date;
    placeholder?: string;
    onChange: (d: Date)=>void;
}

export default (props: IDatePickerProperty) => {
    let [DateValue, setDate] = useState(new Date());
    let [InSelection, setSelection] = useState(false);

    function Selected(d: Date) {
        setDate(d);
        setSelection(false);

        props.onChange(d);
    }

    let txt = Formater.Date(DateValue);

    return <div className="date_picker_container">
        <input
            className="form-control"
            type="textbox"
            placeholder={txt}
            value={txt}
            onClick={() => setSelection(true)}
            readOnly />
        {
            InSelection ? <Calendar Date={DateValue} onSelected={(d) => Selected(d)} /> : null
        }
    </div>;
}

