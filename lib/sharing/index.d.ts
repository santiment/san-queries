declare type SharedColumn = Pick<SAN.Queries.Column, 'title' | 'formatterId' | 'isHidden' | 'chartStyle'>;
export declare function shareColumn({ title, formatterId, chartStyle, isHidden, }: SAN.Queries.Column): SharedColumn;
export declare function sharePanelSettings(settings: SAN.Queries.PanelSettings, sql: {
    parameters: {
        type: string;
    }[];
}): {
    type: import("../types").PanelType;
    xAxisKey: number | undefined;
    layout: number[] | undefined;
    columns: SharedColumn[];
    parameters: {
        type: string;
    }[];
};
export declare function sharePanel(panel: SAN.Queries.DashboardPanel): {
    name: string;
    sql: {
        parameters: {
            [parameter: string]: SAN.Queries.ParameterValue;
        };
        query: string;
    };
    settings: {
        type: import("../types").PanelType;
        xAxisKey: number | undefined;
        layout: number[] | undefined;
        columns: SharedColumn[];
        parameters: {
            type: string;
        }[];
    };
};
export declare function shareDashboard(dashboard: SAN.Queries.Dashboard): {
    name: string;
    sql: {
        parameters: {
            [parameter: string]: SAN.Queries.ParameterValue;
        };
        query: string;
    };
    settings: {
        type: import("../types").PanelType;
        xAxisKey: number | undefined;
        layout: number[] | undefined;
        columns: SharedColumn[];
        parameters: {
            type: string;
        }[];
    };
}[];
export {};
