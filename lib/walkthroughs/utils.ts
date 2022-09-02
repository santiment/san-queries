export function awaitChildren(parentNode, show, acessor) {
  const config = { childList: true }
  const observer = new MutationObserver(() => {
    const node = acessor()
    if (node) {
      show(node)
      observer.disconnect()
    }
  })
  observer.observe(parentNode, config)
}
