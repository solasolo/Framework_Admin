import * as React from "react";
import LinkButton from "./LinkButton";

const ButtonType: any = {
    View: ["info", "eye"],
    Edit: ["primary", "pencil"],
    Add: ["success", "plus"],
    Delete: ["danger", "trash"],
    Config: ["success", "cog"],
};

interface IActionButtonProperty {
    Type: string;
    Title?: string;
    Hint?: string;
    Size?: string;
    onClick(): void;
}

export default (props: IActionButtonProperty) => {
    let type = ButtonType[props.Type];
    let style = type[0];

    return (
        <LinkButton Style={style} {...props}>
            <i className={`fa fa-${type[1]}`}>{" "}{props.Title}</i>
        </LinkButton>
    );
};
