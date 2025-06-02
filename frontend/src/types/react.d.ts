/// <reference types="react" />

declare module 'react' {
  export interface JSX {
    IntrinsicElements: { [elemName: string]: any }
  }
}
