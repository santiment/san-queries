export const internalProxyFetcher = (_: RequestInfo | URL, init?: RequestInit) => fetch('/api/internal', init);
