'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log to console in development; swap for a real error reporting
    // service (e.g. Sentry) when available.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex min-h-[120px] items-center justify-center rounded-xl bg-offwhite px-6 py-8 text-center text-charcoal"
          >
            <p className="body-copy">
              Algo salió mal. Por favor,{' '}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => {
                  globalThis.location.reload();
                }}
              >
                recarga la página.
              </button>
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
