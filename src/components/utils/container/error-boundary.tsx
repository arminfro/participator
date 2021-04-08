import React, { ReactElement } from 'react';

interface ErrorProps {
  children: ReactElement;
  fallback: ReactElement;
}

export default class ErrorBoundary extends React.Component<
  ErrorProps,
  { hasError: boolean; error: null | Error }
> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }
  render() {
    if (this.state.hasError) {
      console.debug('error in ErrorBoundary', this.state.error);
      return this.props.fallback;
    }
    return this.props.children;
  }
}
