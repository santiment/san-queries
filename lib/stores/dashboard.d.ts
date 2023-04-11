import { PanelType } from './../types';
export declare function newPanel(name?: string, type?: PanelType, query?: string): SAN.Queries.DashboardPanel;
export declare function normalizePanel(panel: SAN.Queries.DashboardPanel): SAN.Queries.Panel;
export declare type Dashboard$ = ReturnType<typeof Dashboard>;
export declare const Dashboard: (defaultValue?: null | SAN.Queries.Dashboard) => {
    subscribe: (this: void, run: import("svelte/store").Subscriber<SAN.Queries.Dashboard>, invalidate?: ((value?: SAN.Queries.Dashboard | undefined) => void) | undefined) => import("svelte/store").Unsubscriber;
    set(dashboard: SAN.Queries.Dashboard): void;
};
