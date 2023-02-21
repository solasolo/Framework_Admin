import { useEffect } from "react";
import * as React from 'react';
import WSClient from "./WS";

export function useTimer(fn: () => void, delay: number = 1000) {
    let Runing = true;

    React.useEffect(() => {
        function Run() {
            try {
                fn();
            } finally {
                if (Runing) {
                    DoTimer();
                }
            }
        }

        function DoTimer() {
            setTimeout(() => {
                Run();
            }, delay);
        }

        Run();

        return () => {
            Runing = false;
        };
    }, []);
}

export function useInterval(callback: () => void, delay: number) {
    const savedCallback: any = React.useRef();

    // 保存新回调
    useEffect(() => {
        savedCallback.current = callback;
    });

    // 建立 interval
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function useWS(client: WSClient, code: number, callback: (data: any) => void) {
    useEffect(() => {
        client.Regist(code, callback);

        return () => {
            client.UnRegist(code, callback);
        }
    })

}