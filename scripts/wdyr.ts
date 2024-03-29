/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';
import { useStruct } from '../src/components/utils/hooks/use-struct';

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
      // trackAllPureComponents: true,
      trackExtraHooks: [[useStruct, 'useStruct']],
    });
  }
}
