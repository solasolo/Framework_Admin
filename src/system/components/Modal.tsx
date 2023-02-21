
import * as React from 'react';
import { createPortal } from 'react-dom';
import Utils from "../libs/Utils";
import If from "./If";
import Styles from "../styles/Modal";

interface IW3CHTMLDialogElement extends HTMLDialogElement {
    show(): void;
    hide(): void;
 }

interface IModalProperty extends IBaseProperty {
    Title: string;
    NoFrame?: boolean;
    OnClose(ok: boolean): boolean | Promise<boolean>;
}

export default (props: IModalProperty) => {
    let node = document.body;
    let children = props.children;

    let [show, setShow] = React.useState(false);

    let ModalRef: React.MutableRefObject<HTMLDivElement> = React.useRef();
    let DialogRef: React.MutableRefObject<IW3CHTMLDialogElement> = React.useRef();

    function Central() {
        let modal: any = ModalRef.current;
        let content = modal.children[0];

        content.style.top = (modal.clientHeight - content.clientHeight) / 2 - 30 + "px";
    }

    function Close(ok: boolean) {
        Utils.PromiseInvoke(props.OnClose, [ok], (val: any) => {
            setShow(!val);
        });
    }

    let MaskStyle = Styles.Mask(show);
    let DiallogStyle = Styles.Dialog;
    let HeaderStryle = Styles.Header;

    React.useEffect(() => {
        let modal: any = ModalRef.current;

        window.addEventListener("resize", Central);

        //Central();

        let el_dialog = DialogRef.current;
        if (el_dialog) {
            el_dialog.show();
        }

        setShow(true);

        return () => {
            window.removeEventListener("resize", Central);
        };
    }, []);

    return createPortal(
        <div className="modal fade show" ref={ModalRef} tabIndex={-1} role="dialog" style={MaskStyle} onClick={() => { if (props.NoFrame) { Close(false); } }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <dialog className="modal-content" ref={DialogRef} style={DiallogStyle} onClick={(e) => { e.stopPropagation(); }}>
                    <If Condition={!props.NoFrame}>
                        <div className="modal-header" style={HeaderStryle}>
                            <h5 className="modal-title">{props.Title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={() => { Close(false); }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </If>
                    <div className="modal-body">
                        {children}
                    </div>
                    <If Condition={!props.NoFrame}>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => { Close(false); }}>取消</button>
                            <button type="button" className="btn btn-primary" onClick={() => { Close(true); }}>确认</button>
                        </div>
                    </If>
                </dialog>
            </div>
        </div >,
        node);
};
