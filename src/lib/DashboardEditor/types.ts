export {}

interface DashboardWidget<T extends string> {
  id?: string
  type: T
  htmlNode?: HTMLElement
}

declare global {
  namespace App {
    namespace Dashboard {
      type HeadingWidget = DashboardWidget<'HEADING'> & {
        value: string
      }

      type TextWidget = DashboardWidget<'TEXT'> & {
        value: string
      }

      type QueryWidget = DashboardWidget<'QUERY'> & {
        title: string
        query: App.ApiQuery
        // settings: any
        // parameters: any
      }

      type ImageWidget = DashboardWidget<'IMAGE'> & {
        src: string
      }

      type Widget = HeadingWidget | TextWidget | QueryWidget | ImageWidget
    }
  }
}
