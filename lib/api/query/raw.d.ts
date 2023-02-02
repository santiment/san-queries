export declare const PANEL_DATA_FRAGMENT = "\n  headers:columns\n  rows\n  types:columnTypes\n";
export declare const queryComputeRawClickhouse: (query: string, parameters?: {
    [key: string]: string | number;
} | undefined, requestOptions?: SAN.API.RequestOptions) => Promise<SAN.Queries.SQLResult>;
