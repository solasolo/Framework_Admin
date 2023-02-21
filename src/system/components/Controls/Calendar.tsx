import * as React from 'react';
import Utils from '../../libs/Utils';
import Css from 'cssType';

const popup : Css.Properties = {
    position: 'relative', 
    border: "1px solid",
    zIndex: 100,
    backgroundColor: 'white',
};

function AddDay(d: Date, n: number) {
    let t = d.getTime();
    let nt = t + (24 * 60 * 60 * 1000 * n);

    return new Date(nt);
}

function MonthView(year: number, month: number) {
    let ret = [];

    let FirstDay = new Date(year, month, 1);
    let FirstWeekDay = FirstDay.getDay();
    let StartDay = AddDay(FirstDay, -FirstWeekDay);

    let day = StartDay;
    for (let i = 0; i < 42; i++) {
        ret.push([day.getDate(), day.getMonth() - month]);
        day = AddDay(day, 1);
    }

    return ret;
}

interface IBaseCalendarProperty extends IBaseProperty {
    Year: number;
    Month: number;
    Day: number;

    PrevMonth(): void;
    NextMonth(): void;
}

//
//
//

function CalendarHeader(props: IBaseCalendarProperty) {
    return (
        <tr className="calendar_header">
            <th className="prev" onClick={props.PrevMonth}>&lt;</th>
            <th className="dateInfo" colSpan={5}>{props.Year}年{props.Month + 1}月</th>
            <th className="next" onClick={props.NextMonth}>&gt;</th>
        </tr>
    );
}

//
//
//

interface ICalendarMainProperty extends IBaseCalendarProperty {
    DatePicked(d: Date): void;
}

function CalendarMain(props: ICalendarMainProperty) {
    let rows = Fase();

    function Fase() {
        let ViewData = MonthView(props.Year, props.Month);

        let rows = [];
        for (let i = 0; i < 6; i++) {
            let cols = [];
            for (let j = 0; j < 7; j++) {
                let cls = "";
                let n = i * 7 + j;
                let d = ViewData[n];
                let day = d[0];
                let in_month = d[1];

                if (in_month == 0) {
                    cls = (j == 0 || j == 6) ? "calendar_weekend " : "calendar_normal";

                    if (day == props.Day) { cls += " calendar_selected"; }
                } else {
                    cls = "calendar_out-month";
                }

                let handle = ClickHandle(in_month);

                let cell = <td onClick={handle && handle.bind(this, day)} className={cls} key={n}>
                    {day}
                </td>;
                cols.push(cell);
            }

            let row = <tr>{cols}</tr>;
            rows.push(row);
        }

        return rows;
    }

    function ClickHandle(v: number) {
        let ret = null;

        switch (v) {
            case 0:
                ret = DatePicked;
                break;

            case -1:
                ret = props.PrevMonth;
                break;

            case 1:
                ret = props.NextMonth;
                break;
        }

        return ret;
    }

    function DatePicked(d: number) {
        let date = new Date(props.Year, props.Month, d);

        Utils.Invoke(props.DatePicked, date);
    }


    return <table className="calendar_main">
        <thead>
            <CalendarHeader
                PrevMonth={() => props.PrevMonth()}
                NextMonth={() => props.NextMonth()}
                Year={props.Year}
                Month={props.Month}
                Day={props.Day} />
            <tr className="calendar_title">
                <th>日</th>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>;
}


//
//
//

interface ICalendarProperty extends IBaseProperty {
    Date?: Date;
    onSelected(d: Date): void;
}

export default (props: ICalendarProperty) => {
    let now = props.Date || new Date();

    let [Year, setYear] = React.useState(now.getFullYear());
    let [Month, setMonth] = React.useState(now.getMonth());
    let [Day, setDay] = React.useState(now.getDate());
    let [Pixked, setPicked] = React.useState(false);

    function NextMonth() {
        if (Month === 11) {
            setYear(Year + 1);
            setMonth(0)
        } else {
            setMonth(Month + 1);
        }
    }

    function PrevMonth() {
        if (Month === 0) {
            setYear(Year - 1);
            setMonth(11);
        } else {
            setMonth(Month - 1);
        }
    }

    function Selected(d: Date) {
        Utils.Invoke(props.onSelected, d);
    }

    return <div style={popup}>
        <CalendarMain
            PrevMonth={() => PrevMonth()}
            NextMonth={() => NextMonth()}
            DatePicked={(d) => Selected(d)}
            Year={Year}
            Month={Month}
            Day={Day} />
    </div>;

}
