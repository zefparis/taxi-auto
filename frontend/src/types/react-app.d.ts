/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  export = React;
}

declare namespace React {
  export interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    }
  }
  
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
}
