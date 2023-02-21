import * as React from 'react';
import * as ReactDom from 'react-dom';
import Styles from "../styles/Modal";
import Modal from '../components/Modal';
import { notEqual } from 'assert';

interface IConfirmProperty extends IBaseProperty {
    Text: string;
    OnClose: (ok: boolean) => Promise<boolean>;
    Targe: any;
}


function ConfirmModel(props: IConfirmProperty) {
    let DiallogStyle = Styles.Dialog;

    function Close(ok: boolean) {
        const target = props.Targe;
        if (target) {
            ReactDom.unmountComponentAtNode(target)
            target.parentNode.removeChild(target)
        }

        props.OnClose(ok);
    }

    return <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
        <dialog className="modal-content" style={DiallogStyle} onClick={(e) => { e.stopPropagation(); }}>
            <div className="modal-body">
                <span className="h4">{props.Text}</span>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { Close(false); }}>取消</button>
                <button type="button" className="btn btn-primary" onClick={() => { Close(true); }}>确认</button>
            </div>
        </dialog>
    </div>;
};


export default async function (text: string,): Promise<boolean> {
    let node = document.createElement('div');
    node.className="modal fade show" 
    node.tabIndex=-1;
    node.style.display="block";
    node.style.background = "rgba(0, 0, 0, 0.25)";

    document.body.appendChild(node);

    return new Promise<boolean>((resolve, reject) => {
        async function confirm(ok: boolean) {
            resolve(ok);

            return false;
        }

        ReactDom.render(<ConfirmModel Text={text} OnClose={confirm} Targe={node}/>, node)
    });
};

