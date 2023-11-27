/*
var compressed = btoa(String.fromCharCode(...new Uint8Array(last._data)))
var decompressed = new Uint8Array([...atob(base64)].map((char) => char.charCodeAt(0)))
// ArrayBuffer -> decompressed.buffer
// SingleModelEditStackData.deserialize(decompressed.buffer)
//
//
//

const newElement = new SingleModelEditStackElement(
  'Typing',
  'undoredo.textBufferEdit',
  this._model,
  beforeCursorState,
)



_data: Object { beforeVersionId: 41, afterVersionId: 41, beforeEOL: 0, … },
code: "undoredo.textBufferEdit,
label: "Typing,
model: Object { _store: {…}, _undoRedoService: Proxy, _languageService: {…}, … },

*/

export function saveEditorState(editor: any, queryId?: number) {
  if (!process.browser) return

  if (!queryId) return

  if (!window.sqlEditor) {
    window.sqlEditor = {}
  }

  window.sqlEditor[queryId] = {
    model: editor.getModel(),
    viewState: editor.saveViewState(),
  }
}

export function getEditorState(queryId?: number) {
  return window.sqlEditor?.[queryId] as undefined | any
}
