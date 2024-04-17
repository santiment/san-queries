import type { editor as monacoEditor } from 'monaco-editor'

import { BROWSER } from 'esm-env'

type EditorState = Partial<{
  model: monacoEditor.ITextModel | null
  viewState: monacoEditor.ICodeEditorViewState | null
  // updateParameters: (parameters: { key: string }[]) => void
}>

declare global {
  interface Window {
    SQL_EDITOR?: Record<string | number, EditorState>
  }
}

export function getEditorState(id?: number | string): EditorState {
  if (!BROWSER) return {}

  return window.SQL_EDITOR?.[id as string] || {}
}

export function saveEditorState(editor?: monacoEditor.IStandaloneCodeEditor, id?: number | string) {
  if (!BROWSER) return

  if (!editor) return

  if (!id) return

  if (!window.SQL_EDITOR) {
    window.SQL_EDITOR = {}
  }

  window.SQL_EDITOR[id] = {
    model: editor.getModel(),
    viewState: editor.saveViewState(),
  }
}
