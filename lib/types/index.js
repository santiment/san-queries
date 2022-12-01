export var PanelType;
(function (PanelType) {
    PanelType["TABLE"] = "TABLE";
    PanelType["TEXT"] = "TEXT";
    PanelType["CHART"] = "CHART";
    PanelType["PIE_CHART"] = "PIE_CHART";
})(PanelType || (PanelType = {}));
export const PanelData = [
    {
        type: PanelType.TABLE,
        label: 'Table',
    },
    {
        type: PanelType.TEXT,
        label: 'Text',
    },
    {
        type: PanelType.CHART,
        label: 'Chart',
    },
    {
        type: PanelType.PIE_CHART,
        label: 'Pie Chart',
    },
];
export var ParameterType;
(function (ParameterType) {
    ParameterType["Text"] = "Text";
    ParameterType["Number"] = "Number";
})(ParameterType || (ParameterType = {}));
//# sourceMappingURL=index.js.map