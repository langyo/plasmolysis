import React, { createElememt } from 'react';
import { components } from '../staticRequire';
import { controllerStreamsMapped } from './controllers';

export default state => {
  // TODO views.border
  return <>
    {createElememt(components.pages[state.renderPage], {
      ...state.pages[state.renderPage],
      ...state.data,
      ...controllerStreamsMapped.pages[state.renderPage]
    })}
  </>;
};