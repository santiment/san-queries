export declare const FormatType: {
    readonly NO_FORMATTER: 0;
    readonly DATE: 1;
    readonly MILLLIFY: 2;
    readonly USD: 3;
};
export declare const Formatter: {
    [x: number]: {
        id: number;
        title: string;
        fn: any;
    };
};
export declare const options: {
    id: number;
    title: string;
    fn: any;
}[];
export declare function dateFormatter(timestamp: any): string;
