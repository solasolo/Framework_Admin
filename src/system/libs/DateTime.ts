const ZONE_SHIFT = new Date().getTimezoneOffset() * 6e4;
const DAY_VALUE = 24 * 3600 * 1e3;

export default class DateTime {
    static LocalTime(d?: Date) {
        let ud;

        let type = typeof d;
        switch (type) {
            case "undefined":
                ud = new Date();
                break;

            case "string":
                ud = new Date(d);
                break;

            default:
                ud = d;
        }

        let ld = new Date(ud.getTime() - ZONE_SHIFT);

        return ld;
    }

    static DateString(d?: Date) {
        let txt = "";

        let ld = DateTime.LocalTime(d);
        txt = ld.toISOString().slice(0, 10);

        return txt;
    }

    static TimeString(d?: Date) {
        let txt = "";

        let ld = DateTime.LocalTime(d);
        txt = ld.toISOString().slice(11, 19);

        return txt;
    }

    static DateTimeString(d?: Date) {
        let txt = "";

        let ld = DateTime.LocalTime(d);
        if (ld.valueOf() > 0) {
            txt = ld.toISOString();
            txt = txt.slice(0, 10) + ' ' + txt.slice(11, 19);
        }

        return txt;
    }

    static LocalDayValue(d?: Date) {
        let ld = DateTime.LocalTime(d);

        return Math.trunc(ld.getTime() / DAY_VALUE) * DAY_VALUE + ZONE_SHIFT;
    }
}