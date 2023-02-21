import DateTime from './DateTime';

const Formater = {
    Time(t: Date) {
        return DateTime.TimeString(t);
    },

    Date(t: Date) {
        return DateTime.DateString(t);
    },

    DateTime(t: Date) {
        return DateTime.DateTimeString(t);
    },

    Float(n: any) {
        let txt = "";

        if (n) {
            txt =  Number(n).toFixed(3);
        }

        return txt;
    },

    Fix(d: number) {
        return function(n: any) {
            let txt = "";

            if (n) {
                txt =  Number(n).toFixed(d);
            }
    
            return txt; 
        }
    },

    Money(n: any) {
        let ret = "";

        if (n) {
            ret = "￥" + Number(n).toFixed(2);
        }

        return ret;
    },

    Percent(n: number) {
        let txt = "";

        if (n) {
            let value = n || 0;
            txt = Formater.Money(value * 100) + "%";
        }

        return txt;
    },
};

export default Formater;
