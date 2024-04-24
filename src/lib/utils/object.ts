type Keyified<T> = { [K in keyof T]: T[K] & { key: K } }
export function keyify<T>(object: T): Keyified<T> {
  for (const key in object) {
    const value = object[key] as { key: string }
    value.key = key
  }
  return object as Keyified<T>
}
