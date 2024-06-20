import type { Editor, Range } from '@tiptap/core'

export const COMMANDS = [
  {
    title: 'Heading 1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    },
  },

  {
    title: 'Bold',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark('bold').run()
    },
  },
  {
    title: 'Italic',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setMark('italic').run()
    },
  },

  {
    title: 'Query Widget',
    command: ({ editor, range }) => {
      editor.options.editorProps.showAddQueryToDashboardDialog({
        onComplete(widget) {
          editor.options.editorProps.addQueryWidget(widget)

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .addQueryWidget(widget.dashboardQueryMappingId)
            .run()
        },
      })
    },
  },

  {
    title: 'Asset selector',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).addAssetSelectorWidget().run()
    },
  },
] as { title: string; command: (args: { editor: Editor; range: Range }) => void }[]
