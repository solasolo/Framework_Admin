import * as React from 'react';

declare interface IErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<{}, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryState) {
        super(props);
        this.state = { hasError: false };
    }

    public componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log(error, info);
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}