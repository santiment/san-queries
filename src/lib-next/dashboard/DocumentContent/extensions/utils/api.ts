export function internalProxyFetcher(_: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch('/api/internal', {
    ...init,
  });
}
