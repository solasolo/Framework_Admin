import * as React from "react";
import Utils from "../../libs/Utils";

function RemoveProps(props: any) {
    let { Title, Name, Type, Value, ReadOnly, Rule, Inline, List, ControlRef,  ...others } = props;

    return others;
}

export interface IInputProperty extends IBaseProperty {
    Title: string;
    Name: string;
    Type?: "textbox" | "textpwd" | "select" | "file" | "datetime";
    Value?: string;
    ReadOnly?: boolean;
    Rule?: string;
    Inline?: boolean;
    List?: any | any[];
    ControlRef?: any;

    onChange?(): void;
    onSelect?(): void;
}

export function Hidden(props: IInputProperty) {
    let others = RemoveProps(props);

    return <input
        type="hidden"
        name={props.Name}
        placeholder={props.Value ? undefined : props.Title}
        className="form-control"
        defaultValue={props.Value}
        data-rule={props.Rule}

        {...others}
    />;
}

export const TextBox = React.forwardRef((props: IInputProperty, ref: any) => {
    let others = RemoveProps(props);

    return <input
        ref={ref}
        type="textbox"
        name={props.Name}
        disabled={!!props.ReadOnly}
        placeholder={props.Value ? undefined : props.Title}
        className="form-control"
        defaultValue={props.Value}
        data-rule={props.Rule}

        {...others}

        onKeyPress={(event) => {
            if (event.charCode == 0x0d) {
                Utils.Invoke(props.onChange);
            }
        }}
    />;
});

export const TextPassword = React.forwardRef((props: IInputProperty, ref: any) => {
    return <input
        ref={ref}
        type="password"
        name={props.Name}
        placeholder={props.Title}
        className="form-control"
        data-rule="string"
    />;
});

export function TextArea(props: IInputProperty) {
    return <textarea
        name={props.Name}
        ref={props.ControlRef}
        rows={5}
        placeholder={props.Title}
        className="form-control"
        defaultValue={props.Value}
        data-rule={props.Rule}
    ></textarea>;
}

export const Select = React.forwardRef((props: IInputProperty, ref: any) => {
    let lst: any = props.List;
    let options: any[] = [];
    let hasOptions = false;

    if (lst) {
        if (Array.isArray(lst)) {
            if (lst.length > 0) {
                options = lst.map((key) => {
                    return <option key={key} value={key}>{key}</option>;
                });

                hasOptions = true;
            }
        } else {
            let keys = Object.keys(lst);

            if (keys.length > 0) {
                options = keys.map((key) => {
                    return <option key={key} value={key}>{lst[key]}</option>;
                });

                hasOptions = true;
            }
        }
    }

    let others = RemoveProps(props);

    return <select
        ref={ref}
        name={props.Name}
        placeholder={props.Title}
        className="form-control"
        defaultValue={props.Value}

        {...others}
    >
        {options}
    </select>;
});

export function File(props: IInputProperty) {
    const FileRef: React.MutableRefObject<any> = React.useRef();
    const TextRef: any = React.useRef();

    function OpenFile(): void {
        const el: any = FileRef.current;
        if (el) {
            el.click();
        }
    }

    function UpdateFile(e: React.ChangeEvent): void {
        const el: any = TextRef.current;
        if (el) {
            el.value = (e.target as any).value;
        }
    }

    return <>
        <div className="form-group form-file-upload form-file-simple">
            <label className="control-label">{props.Title}</label>
            <input type="file" name={props.Name} className="inputFileHidden" ref={FileRef} onChange={UpdateFile} />
            <div className="input-group">
                <input type="text" className="form-control inputFileVisible" readOnly ref={TextRef} placeholder="Select File" onClick={OpenFile} />
                <span className="input-group-btn">
                    <button type="button" className="btn btn-fab btn-round btn-primary" onClick={OpenFile}>
                        <i className="material-icons">attach_file</i>
                    </button>
                </span>
            </div>
        </div>
    </>;
};