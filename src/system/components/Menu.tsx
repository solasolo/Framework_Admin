import * as React from "react";

import Utils from "system/libs/Utils";
import Styles from "../styles/Menu";
import { IMenuProperties, IMenuItemProperties, SelectedIndex } from "./BaseMenu";

export default (props: IMenuProperties) => {
    const [select, setSelect] = React.useState(SelectedIndex(props.Data));

    const Item = (props: IMenuItemProperties) => {
        const index = props.Index;
        const link = Utils.Link(props.Data.Route);
        const active = (select === index) ? " active" : "";

        return <li className={"nav-item" + active} onClick={()=>{setSelect(index)}}>
            <a className="nav-link" href={link} style={Styles.Link}>
                <i className="material-icons"></i>
                <p style={Styles.Text}>{props.Data.Text}</p>
            </a>
        </li>
    }

    let items = props.Data.map((el, ind) => <Item key={ind} Index={ind} Data={el} />);

    return <ul className="navdrawer-nav">{items}</ul>;
}

