/// <reference types="san-webkit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

declare module '@storybook/svelte' {
  export interface Parameters {
    mockApi?: (story?: any) => Record<string, any>
  }
}

declare module 'vitest/config' {
  export interface UserConfig {
    clientDefines?: Record<string, any>
    serverDefines?: Record<string, any>
  }
}

export {}
