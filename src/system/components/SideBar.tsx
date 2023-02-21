import * as React from "react";

interface ISideBarProperty extends IBaseProperty {
    Width: string;
}

const SideBarStyle: any = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    backgroundColor: "white",
};

export default (prop: ISideBarProperty) => {
    SideBarStyle.width = prop.Width;

    return <div className="sidebar" style={SideBarStyle}>
        {prop.children}
    </div>;
}