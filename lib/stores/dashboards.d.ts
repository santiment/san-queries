import type { ShortDashboard } from './../api/dashboard';
export declare const myDashboards$: {
    DEFAULT: ShortDashboard[];
    fetched: boolean;
    set: (value: ShortDashboard[]) => ShortDashboard[];
    subscribe(run: import("svelte/store").Subscriber<ShortDashboard[]>, invalidate: any): import("svelte/store").Unsubscriber;
    clear(): void;
    query(): Promise<ShortDashboard[]>;
    refetch(): Promise<ShortDashboard[]> | undefined;
    resetToDefault(): void;
};
