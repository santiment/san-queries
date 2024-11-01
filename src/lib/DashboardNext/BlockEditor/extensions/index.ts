import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Heading } from '@tiptap/extension-heading'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { BulletList } from '@tiptap/extension-bullet-list'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import BlockLayout, { Column, Columns } from 'tiptap-block-layout'

import QueryBlock from '../nodes/QueryBlock'
import AssetSelector from '../nodes/AssetSelector'
import Paragraph from '../nodes/Paragraph'
import HiddenBlock from '../nodes/HiddenBlock'
import QueryTextColumnBlock from '../nodes/QueryTextColumnBlock'
import ControlledListBlock from '../nodes/ControlledListBlock'
import SanbaseChartBlock from '../nodes/SanbaseChartBlock'
import TextInputField from '../nodes/TextInputField'

export const getExtensions = (ctx?: Map<string, any>) => [
  StarterKit.configure({
    dropcursor: false,
    gapcursor: false,
    paragraph: false,
    heading: false,
    orderedList: false,
    bulletList: false,
  }),
  Paragraph,
  Heading.configure({ HTMLAttributes: { class: 'data-heading' } }),
  Link.configure({ openOnClick: false, HTMLAttributes: { class: 'data-link' } }),
  OrderedList.configure({ HTMLAttributes: { class: 'data-list' } }),
  BulletList.configure({ HTMLAttributes: { class: 'data-list' } }),

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
  QueryBlock.configure({ ctx }),
  AssetSelector.configure({ ctx }),
  QueryTextColumnBlock.configure({ ctx }),
  ControlledListBlock.configure({ ctx }),
  SanbaseChartBlock.configure({ ctx }),
  TextInputField.configure({ ctx }),
]
