import * as React from "react";

export interface IMenuItem {
    Text: string;
    Icon?: string;
    Route: string;
}

export interface IMenuProperties extends IBaseProperty {
    Data: IMenuItem[];
}

export interface IMenuItemProperties extends IBaseProperty {
    Index: number;
    Data: IMenuItem;
    Active?: boolean;
    OnClick?: () => void;
}

export function SelectedIndex(data: IMenuItem[]) {
    let ret = null;
    let router = new Url().Hash;

    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        if (d.Route === router) {
            ret = i;
        }
    }

    return ret;
}

export const MenuToggler = () => {
    return <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
        <span className="sr-only">Toggle navigation</span>
        <span className="navbar-toggler-icon icon-bar"></span>
        <span className="navbar-toggler-icon icon-bar"></span>
        <span className="navbar-toggler-icon icon-bar"></span>
    </button>;
};

