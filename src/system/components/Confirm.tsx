import * as React from 'react';
import Modal from './Modal';

interface IConfirmProperty {
    Text: string;
    OnClose: (ok: boolean) => Promise<boolean>;
}


export default (props: IConfirmProperty) => {
   return <Modal Title="请确认" OnClose={props.OnClose}>
       {props.Text}
   </Modal>;
};
