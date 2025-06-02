// Type declarations for next/navigation
declare module 'next/navigation' {
  export function useRouter(): {
    back: () => void;
    forward: () => void;
    refresh: () => void;
    push: (href: string, options?: { scroll?: boolean }) => void;
    replace: (href: string, options?: { scroll?: boolean }) => void;
    prefetch: (href: string) => void;
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T = Record<string, string | string[]>>(): T;
}
