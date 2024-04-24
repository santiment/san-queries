export const errorify = <T>(promise: Promise<T>): Promise<[T] | [null, { message: string }]> =>
  promise.then((data) => [data] as [T]).catch((e) => [null, Array.isArray(e) ? e[0] : e])
