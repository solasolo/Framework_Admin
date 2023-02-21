import * as React from "react";
import { CellStyle } from "../styles/Table";
import { MakeStyle } from "../libs/Style";

declare interface ITableRowProperty extends IBaseProperty {
    Columns: IColumnDefine[];
    Data: any;

    OnDoubleClick: (d: any, n: number) => void;
}

declare interface ITableHeadProperty extends IBaseProperty {
    Columns: IColumnDefine[];
}

declare interface ITableProperty extends IBaseProperty {
    RowKey?: string;
    Strip?: boolean;
    Columns: IColumnDefine[];
    DataSource: any[];

    OnDoubleClick?: (d: any, n: number) => void;
}

function TableRow(props: ITableRowProperty) {
    let data = props.Data;

    let cols = props.Columns.map((item: IColumnDefine, ind: number) => {
        let value: any = "";
        let field = item.Field;

        // Parser Value
        if (field) {
            if (field.indexOf('.') == -1) {
                value = data[field];
            } else {
                let filed_parts = field.split('.');

                value = data;
                for (let f of filed_parts) {
                    value = value[f];
                    if (value == undefined) break;
                }
            }
        }

        if (item.Render) {
            value = item.Render(data, value);
        } else if (item.Text) {
            value = item.Text(value);
        }

        let align = "text-" + (item.Align || 'left');

        let fn_dbclk = props.OnDoubleClick ? () => props.OnDoubleClick(data, ind) : null;

        return <td key={item.Field || item.Key} className={align} onDoubleClick={fn_dbclk} style={CellStyle}>{value}</td>;
    });

    return (
        <tr>
            {cols}
        </tr>
    );
}

function TableHead(props: ITableHeadProperty) {
    let cols = props.Columns.map((item: IColumnDefine) => {
        let cell_style = MakeStyle([CellStyle, { width: item.Width }]);

        return <th key={item.Field || item.Key} style={cell_style}>{item.Title}</th>;
    });

    return (
        <thead className="text-primary">
            <tr className="text-center">
                {cols}
            </tr>
        </thead>
    );
}

function TableBody(props: ITableProperty) {
    let rows = null;

    if (Array.isArray(props.DataSource)) {
        rows = props.DataSource.map((item: any, index: number) => {
            let key = item[props.RowKey] || index;

            return <TableRow key={key} Columns={props.Columns} Data={item} OnDoubleClick={props.OnDoubleClick} />;
        });
    }

    return <>{rows}</>;
}

export function Table(props: ITableProperty) {
    let TableRef = React.useRef();

    const TableStyle = {

    };

    let striped = props.Strip ? " table-striped" : "";

    return <>
        <table ref={TableRef} className={"table table-bordered table-hover" + striped} style={TableStyle}>
            <TableHead Columns={props.Columns} />
            <tbody>
                {props.DataSource ? <TableBody {...props} /> : null}
            </tbody>
        </table>
    </>;
}


