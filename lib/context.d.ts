import type { Dashboard$ } from './stores/dashboard';
export declare const APP_CTX = "APP_CTX";
export declare type Context = {
    dashboard$: Dashboard$;
};
export declare const setAppContext: (ctx: Context) => Context;
export declare const getAppContext: () => Context;
