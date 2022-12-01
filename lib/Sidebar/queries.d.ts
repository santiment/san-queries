export declare const Dashbaord: (title: string, panels: {
    name: string;
    query: string;
    parameters?: SAN.Queries.SQL['parameters'];
}[]) => {
    title: string;
    panels: SAN.Queries.DashboardPanel[];
    votes: {};
};
export declare const PremadeDashboards: {
    title: string;
    panels: SAN.Queries.DashboardPanel[];
    votes: {};
}[];
