import * as React from "react";

import Utils from "system/libs/Utils";

interface IPaginationProperty {
    Page: number;
    onChange(num: number): void;
}

declare interface IPaginationDefine {
    OnChange(num: number): void;
}

export default (props: IPaginationProperty) => {
    let Size = 11;
    let Start = 1;
    let Current = props.Page;

    function PaginationItem(num: number | string, fun: any) {
        let active = (num === Current) ? " active" : "";

        return <li className={"page-item" + active} key={num}>
            <a className="page-link" onClick={fun}>{num}</a>
        </li>;
    }

    function ForwardItem() {
        return <>
            {PaginationItem("|<", () => First())}
            {PaginationItem("<", () => Previous())}
        </>;
    }

    function BackItem() {
        return <>
            {PaginationItem(">", () => Nest())}
            {PaginationItem(">>", () => Last())}
        </>;
    }

    function First() {
        Change(1);
    }

    function Previous() {
        Change(Current - 1);
    }

    function Nest() {
        Change(Current + 1);
    }

    function Last() {
        Change(Current + Size);
    }

    function Move(num: number) {
        let start = Start;

        if (num > 0) {
            if (num <= start || num >= start + Size - 1) {
                start = num - 5;
                if (start < 1) { start = 1; }
            }
        } else {
            num = 1;
            start = 1;
        }

        Current = num;
        Start = start;
    }

    function Change(num: number) {
        if (num > 0) {
            Utils.Invoke(props.onChange, num);
        }
    }

    function Click(num: number) {
        Change(num);
    }

    let PageItemList = [];
    Move(props.Page);

    PageItemList.push(ForwardItem());

    for (let i = Start; i < Size + Start; i++) {
        let item = PaginationItem(i, () => Click(i));
        PageItemList.push(item);
    }

    PageItemList.push(BackItem());

    return (
        <div>
            <ul className="pagination">
                {PageItemList}
            </ul>
        </div>
    );
}
