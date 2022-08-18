import { formatUsd, millify } from 'san-webkit/lib/utils/formatting';
import { getDateFormats } from 'san-webkit/lib/utils/dates';
export const FormatType = {
    // NOTE: Values should not be changed!!! [@vanguard]
    NO_FORMATTER: 0,
    DATE: 1,
    MILLLIFY: 2,
    USD: 3,
};
const Format = (id, title, fn) => ({
    [id]: { id, title, fn },
});
export const Formatter = Object.assign(Format(FormatType.NO_FORMATTER, 'No formatting'), Format(FormatType.DATE, 'Date', dateFormatter), Format(FormatType.MILLLIFY, 'Millify', millify), Format(FormatType.USD, 'USD', formatUsd));
export const options = Object.values(Formatter);
export function dateFormatter(date) {
    const { D, MMM, YY } = getDateFormats(new Date(date));
    return `${D} ${MMM}, ${YY}`;
}
//# sourceMappingURL=format.js.map