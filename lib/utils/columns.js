export function shareColumn({ title, formatterId, chartStyle, isHidden, }) {
    const column = { title, chartStyle, formatterId };
    if (isHidden)
        column.isHidden = true;
    return column;
}
//# sourceMappingURL=columns.js.map