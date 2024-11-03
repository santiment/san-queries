import { getBaseExtensions } from '../DocumentContent/extensions'
import type { TParsedDashboard } from '../parse'
import type { TDocumentNode } from '../parse/version-2'

export function validateDashboardDocument(data: TParsedDashboard) {
  const extensions = getBaseExtensions()

  const knownExtensionSet = new Set(extensions.map((item) => item.name))
  function validateContent(node: TDocumentNode) {
    if (knownExtensionSet.has(node.type) === false) return false

    if (node.content) {
      node.content = node.content.filter(validateContent)
    }

    return true
  }

  data.documentContent.content = data.documentContent.content.filter(validateContent)

  return data
}
