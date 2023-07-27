/// <reference types="san-webkit" />
/// <reference types="san-webkit/.storybook/mock/index" />

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

declare module 'vitest/config' {
  export interface UserConfig {
    clientDefines?: Record<string, any>
    serverDefines?: Record<string, any>
  }
}

export {}
