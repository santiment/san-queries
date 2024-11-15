import { getBaseExtensions } from '../DocumentContent/extensions'
import type { TParsedDashboard } from '../parse'
import type { TDocumentNode } from '../types'

export function validateDashboardDocument(data: TParsedDashboard) {
  const { documentContent } = data
  const extensions = getBaseExtensions()

  const knownExtensionSet = new Set(extensions.map((item) => item.name))
  function validateContent(node: TDocumentNode) {
    if (knownExtensionSet.has(node.type) === false) return false

    if (node.content) {
      node.content = node.content.filter(validateContent)
    }

    return true
  }

  documentContent.content = documentContent.content.filter(validateContent)

  if (documentContent.content.length === 0) {
    documentContent.content.push({ type: 'paragraph' })
  }

  return data
}
