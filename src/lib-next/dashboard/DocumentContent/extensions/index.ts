import type { TDataWidgetNode } from './schema/data-widget'
import type { TParameterWidgetNode } from './schema/parameter-widget'

import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Underline from '@tiptap/extension-underline'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import History from '@tiptap/extension-history'
import CodeBlock from '@tiptap/extension-code-block'

import BlockLayout, { Column, Columns } from 'tiptap-block-layout'

import Paragraph from './paragraph-block-node'
import AssetSelectorNode from './asset-selector-node'
import TextInputFieldNode from './text-input-field-node'
import QueryWidgetBlockNode from './query-widget-block-node'
import ControlledListBlockNode from './controlled-list-block-node'
import SanbaseChartBlockNode from './sanbase-chart-block-node'
import HiddenBlockNode from './hidden-block-node'
import QueryTextColumnBlockNode from './query-text-column-block-node'
import DateCalendarFieldNode from './date-calendar-field-node'
import AssetInfoBlockNode from './asset-info-block-node'

const DATA_WIDGET_NODES = [QueryWidgetBlockNode, SanbaseChartBlockNode, AssetInfoBlockNode] as const
export type TDataWidgetNodes = (typeof DATA_WIDGET_NODES)[number]['__schema']

const GLOBAL_PARAMETER_WIDGET_NODES = [
  TextInputFieldNode,
  AssetSelectorNode,
  ControlledListBlockNode,
  DateCalendarFieldNode,
] as const
export type TGlobalParameterWidgetNodes = (typeof GLOBAL_PARAMETER_WIDGET_NODES)[number]['__schema']

export const getBaseExtensions = (ctx?: Map<string, any>) =>
  [
    Document,
    Paragraph,
    History,
    HorizontalRule,

    Text,
    Bold,
    Italic,
    Strike,

    Heading.configure({ HTMLAttributes: { class: 'data-heading' } }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'data-link' } }),

    OrderedList.configure({ HTMLAttributes: { class: 'data-list' } }),
    BulletList.configure({ HTMLAttributes: { class: 'data-list' } }),
    ListItem,

    Underline,
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    CodeBlock,

    Columns,
    Column,
    BlockLayout.configure({ dropareaColor: 'var(--droparea-color)' }),

    HiddenBlockNode,

    QueryTextColumnBlockNode.configure({ ctx }),
  ]
    .concat(GLOBAL_PARAMETER_WIDGET_NODES.map((node) => node.configure({ ctx })))
    .concat(DATA_WIDGET_NODES.map((node) => node.configure({ ctx })))

type T_GLOBAL_PARAMETER_WIDGET_NODES = typeof GLOBAL_PARAMETER_WIDGET_NODES
export type TParameterWidgetNodeSchemas = T_GLOBAL_PARAMETER_WIDGET_NODES[number]['__schema']
export const GlobalParameterNodes = GLOBAL_PARAMETER_WIDGET_NODES.reduce(
  (acc, item) => {
    acc[item.config.name] = item.config as TParameterWidgetNode
    return acc
  },
  {} as Record<string, undefined | TGlobalParameterWidgetNodes>,
)

type T_DATA_WIDGET_NODES = typeof DATA_WIDGET_NODES
export type TDataWidgetNodeSchemas = T_DATA_WIDGET_NODES[number]['__schema']
export const DataWidgetNodes = DATA_WIDGET_NODES.reduce(
  (acc, item) => {
    // @ts-ignore
    acc[item.config.name] = item.config as TDataWidgetNode
    return acc
  },
  {} as {
    [K in T_DATA_WIDGET_NODES[number] as K['__schema']['name']]: K['__schema']
  },
)
