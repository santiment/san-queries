import { getContext, setContext } from 'svelte';
export const APP_CTX = 'APP_CTX';
export const setAppContext = (ctx) => setContext(APP_CTX, ctx);
export const getAppContext = () => getContext(APP_CTX);
//# sourceMappingURL=context.js.map