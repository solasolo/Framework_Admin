import * as React from "react";
import LabeledControl from "./Controls/LabeledControl";
import { IInputProperty, Select, File, TextBox, TextArea, TextPassword } from "./Controls/RawInput";
import DatePicker from './Controls/DatePicker';

const popup_container: React.CSSProperties = {
    position: 'relative',
    height: "35px",
};

const InputMap: any = {
    "textarea": TextArea,
    "textbox": (props: IInputProperty) => <TextBox {...props}/>,
    "textpwd": (props: IInputProperty) => <TextPassword {...props}/>,
    "select": (props: IInputProperty) => <Select {...props}/>,
    "file": File,
    "datetime": (props: IInputProperty) => <DatePicker Name={props.Name} Date={new Date(props.Value)} onChange={props.onChange} />,
};

export default (props: IInputProperty) => {
    let ret;

    let type: string = props.Type || "textbox";
    let element: any = InputMap[type];
    let child: any;
    let style: any;

    if (element) {
        child = element(props);
        style = (props.Inline && type === "date_picker") ? popup_container : null;
    }

    switch (type) {
        case "file":
            ret = child;
            break;

        default:
            ret = <LabeledControl Title={props.Title} InLine={props.Inline}>{child}</LabeledControl>;
    }

    return ret;
};
