import * as React from "react";

interface IFormProperty extends IBaseProperty {
    Name?: string;
    Data?: any;
    // onCreate(me: Form): void;
}

export default class Form extends React.Component<IFormProperty> {
    private ThisRef: React.RefObject<any>;

    public constructor(props: IFormProperty) {
        super(props);

        this.ThisRef = React.createRef();
    }

    public componentDidMount() {
        this.Set(this.props.Data);

        /*
        if (this.props.onCreate) {
            this.props.onCreate(this);
        }
        */
    }

    public render() {
        let children = this.props.children;

        return (
            <form ref={this.ThisRef} {...this.props} >
                {children}
            </form>
        );
    }

    public Get() {
        return Api.Form.Get(this.ThisRef.current);
    }

    public Set(data: any) {
        let d = data;
        if(typeof data === 'function') {
            d = data();
        }

        Api.Form.Set(this.ThisRef.current, d);
    }

    public Validate() {
        let res = {};
        let ret = Api.Form.Validate(this.ThisRef.current, res);
        
        if (ret) {
            res = null;
        }

        return res;
    }
}
