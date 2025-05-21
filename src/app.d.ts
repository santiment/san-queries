/// <reference types="san-webkit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      theme: 'night-mode' | ''
      isCookiesVisible: boolean

      customer: import('san-webkit-next/ctx/customer/api').TCustomer | undefined
      device: import('san-webkit-next/ctx/device').DeviceType

      old_device: any
      old_currentUser: null
      old_customer: object
    }
    // interface PageData {}
    // interface Platform {}
    //

    type Empty<T> = null | undefined | T

    type Author = {
      id: number
      username?: App.Empty<string>
      avatarUrl?: App.Empty<string>
    }

    type SqlData = {
      columns: string[]
      columnTypes: string[]
      rows: (number | string | null)[][]
    }
  }

  interface Window {
    authMethod?: string
    onGdprAccept?: () => void
  }
}

export {}
