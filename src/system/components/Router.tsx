import * as React from "react";
import { HashRouter, Switch as Routes, Route } from "react-router-dom";
import ErrorBoundary from "system/components/Error";

interface IRouterItemProperty {
    path: string;
    component: React.Component;
    default?: boolean;
}

interface IRouterProperty extends IBaseProperty {
    Data: IRouterItemProperty[];
}

function getDefault(data: any[]) {
    let ret: any = null;

    for (let e of data) {
        if (e.default) {
            ret = e.module.default;
            break;
        }
    }

    return <Route key="DEFAULT" exact path="/" component={ret} />;
}

function getSub(data: any[]) {
    return data.map((e, i) => {
        return <Route key={e.path} exact path={e.path} component={e.module.default} />;
    });
}

function PageRoute(props: IRouterProperty) {
    return <>
        {getDefault(props.Data)}
        {getSub(props.Data)}
    </>;
}

export default (props: IRouterProperty) => {
    return <HashRouter hashType="slash">
        <ErrorBoundary>
            <Routes>
                <PageRoute Data={props.Data} />
                {props.children}
            </Routes>
        </ErrorBoundary>
    </HashRouter>;
};
