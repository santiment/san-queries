/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="san-webkit" />

declare module '*.png' {
  const value: string
  export = value
}

declare namespace NodeJS {
  interface Process {
    browser: boolean
    GQL_SERVER_URL: string
  }
}
