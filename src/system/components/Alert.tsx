import * as React from 'react';
import { createPortal } from 'react-dom';

interface IAlertProperty {
    Type?: string;
    Message: string;
    OnDismiss: (data: any) => void;
}

export default (props: IAlertProperty) => {
    let node = document.getElementById("message");
    jQuery(node).css("top", "-80px").animate({ top: '0px' });

    setTimeout(() => {
        jQuery(node).animate({ top: '-80px' }, 500, null, () => {
            props.OnDismiss(null);
        });
    }, 2000);

    return createPortal(
        <div className="alert alert-info" role="alert">
            <span className="text-center">{props.Message}</span>
        </div>,
        node,
    );
};
