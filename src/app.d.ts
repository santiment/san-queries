/// <reference types="san-webkit" />
/// <reference types="san-webkit/.storybook/mock/index" />

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

    export type RequestEvent = import('webkit/api').RequestEvent | undefined
  }

  interface Window {
    authMethod?: string
    onGdprAccept?: () => void
  }
}

declare module 'vitest/config' {
  export interface UserConfig {
    clientDefines?: Record<string, any>
    serverDefines?: Record<string, any>
  }
}

export {}
