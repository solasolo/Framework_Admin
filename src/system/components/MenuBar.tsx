import * as React from "react";

import Utils from "system/libs/Utils";
import { IMenuProperties, IMenuItemProperties, SelectedIndex, MenuToggler } from "./BaseMenu";

const MenuBarTextStyle = {
    fontSize: "14px",
};



export default (props: IMenuProperties) => {
    const [select, setSelect] = React.useState(SelectedIndex(props.Data));

    function MenuItem(props: IMenuItemProperties) {
        const index = props.Index;
        const link = Utils.Link(props.Data.Route);
        const active = (select === index) ? " active" : "";

        return <li className={"nav-item" + active} onClick={() => { setSelect(index); }}>
            <a className="nav-link" href={link} style={MenuBarTextStyle}>{props.Data.Text}</a>
        </li>;
    }

    let items = props.Data.map((el, ind) => <MenuItem key={ind} Index={ind} Data={el} />);

    return <header className="navbar navbar-expand-md bg-primary">
        <div className="container">
            <MenuToggler />
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    {items}
                </ul>
            </div>
        </div>
    </header>;
};
