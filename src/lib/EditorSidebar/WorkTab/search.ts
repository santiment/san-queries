const getRegExp = (searchInput: string) => new RegExp(searchInput.replace(/[\W_]+/g, '(.*)'), 'i')
export function applySearch<T>(
  input: string,
  data: T,
  modify: (searchInput: RegExp, item: T) => boolean,
) {
  if (!input) return data

  const regex = getRegExp(input)
  return modify(regex, data)
}
