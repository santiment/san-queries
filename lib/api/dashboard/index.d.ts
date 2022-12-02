export declare const queryDashboard: (id: number) => Promise<SAN.Queries.Dashboard>;
export declare const setQueryDashboardCache: (id: number, dashboard: any) => void;
export declare const deleteQueryDashboardCache: (id: number) => void;
export declare const RECENT_USER_DASHBOARDS_QUERY = "{\n  currentUser {\n    dashboards {\n      id\n      title:name\n      description\n      updatedAt\n    }\n  }\n}";
export declare type ShortDashboard = {
    id: number;
    title: string;
    description?: string;
    updatedAt: string;
};
export declare const queryUserDashboards: () => Promise<ShortDashboard[]>;
