export declare const queryDashboard: (id: number) => Promise<SAN.Queries.Dashboard>;
export declare const setQueryDashboardCache: (id: number, dashboard: any) => void;
export declare const deleteQueryDashboardCache: (id: number) => void;
export declare const RECENT_USER_DASHBOARDS_QUERY = "{\n  getMostRecent(types: [DASHBOARD], page: 1, pageSize: 30, currentUserDataOnly: true) {\n    data {\n      dashboard {\n        id\n        title:name\n        description\n      }\n    }\n  }\n}";
export declare type ShortDashboard = {
    id: number;
    title: string;
    description: any;
};
export declare const queryUserDashboards: () => Promise<ShortDashboard[]>;