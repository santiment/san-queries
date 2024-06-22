import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import BlockLayout, { Column, Columns } from 'tiptap-block-layout'

import QueryBlock from '../nodes/QueryBlock'
import AssetSelector from '../nodes/AssetSelector'
import Paragraph from '../nodes/Paragraph'
import HiddenBlock from '../nodes/HiddenBlock'
import QueryTextColumnBlock from '../nodes/QueryTextColumnBlock'

export const getExtensions = (CTX?: Map<string, any>) => [
  StarterKit.configure({
    dropcursor: false,
    gapcursor: false,
    paragraph: false,
  }),
  Paragraph,
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

  HiddenBlock,
  QueryBlock.configure({ ctx: CTX }),
  AssetSelector.configure({ ctx: CTX }),
  QueryTextColumnBlock.configure({ ctx: CTX }),
]
