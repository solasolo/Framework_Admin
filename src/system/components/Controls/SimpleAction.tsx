import * as React from "react";
import LinkButton from "./LinkButton";

interface ISimpleActionProperty {
    Style?: string;
    Title?: string;
    Hint?: string;
    Size?: string;
    onClick(): void;
}

export default (props: ISimpleActionProperty) => {
    return <LinkButton {...props}>
        {props.Title}
    </LinkButton>;
};
