import React, { ReactElement } from 'react';
import { ApiError } from '../funcs/api';

type Errors = Error | ApiError;

interface ErrorProps {
  children: ReactElement;
  fallback: (e: Errors) => ReactElement;
}

export default class ErrorBoundary extends React.Component<
  ErrorProps,
  { hasError: boolean; error: null | Errors }
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
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}
