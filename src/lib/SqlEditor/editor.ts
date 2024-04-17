import { editor as monacoEditor } from 'monaco-editor'
import { THEME, setupInstance } from './theme'

export async function createEditor(
  node: HTMLElement,
  value: string,
  {
    model,
    ...options
  }: monacoEditor.IEditorOverrideServices & {
    model?: monacoEditor.ITextModel | null
  },
) {
  const _model = model ?? (await setupInstance(value)).model

  const editor = monacoEditor.create(node, {
    ...options,

    value,
    theme: THEME,
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 18,

    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    renderLineHighlight: 'none',
    overviewRulerLanes: 0,
    scrollbar: { verticalScrollbarSize: 2, alwaysConsumeMouseWheel: false },
    padding: { top: 15, bottom: 15 },
    wordWrap: 'on',
    // @ts-expect-error
    'bracketPairColorization.enabled': false,
  })

  if (_model) editor.setModel(_model)

  return {
    editor,
    // @ts-expect-error
    updateParameters: _model.__updateParameters as
      | undefined
      | ((parameters: { key: string }[]) => void),
  }
}
