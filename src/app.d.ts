/// <reference types="san-webkit" />

import type { DeviceInfoType } from 'san-webkit/lib/stores/responsive'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      currentUser: App.CurrentUser | null
      device: DeviceInfoType
      theme: 'night-mode' | ''
      isCookiesVisible: boolean
      customer: SAN.Customer
    }
    // interface PageData {}
    // interface Platform {}
    //
  }

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

  interface Window {
    authMethod?: string
    onGdprAccept?: () => void
  }
}

export {}
