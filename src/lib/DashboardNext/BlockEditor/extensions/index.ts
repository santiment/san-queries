import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import BlockLayout, { Column, Columns } from 'tiptap-block-layout'

import QueryBlock from '../nodes/QueryBlock'

export const getExtensions = (CTX?: Map<string, any>) => [
  StarterKit.configure({
    dropcursor: false,
    gapcursor: false,
  }),
  Link.configure({ openOnClick: false }),
  Underline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),

  Columns,
  Column,
  BlockLayout.configure({ dropareaColor: 'var(--droparea-color)' }),

  QueryBlock.configure({ ctx: CTX }),
]
