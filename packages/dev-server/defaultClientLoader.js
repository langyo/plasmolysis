import React from 'react';
import { hydrate } from 'react-dom';
import {
  connect,
  register,
  buildRootNode,
  loadActionModel
} from '../client';

import presetActionPackage from '../action-preset';
loadActionModel(presetActionPackage);

import RootComponent from '../../components/index';
import RootController from '../../controllers/index';

import OverviewPage from '../../components/overviewPage';
import overviewPageCtx from '../../controllers/overviewPage';
connect(OverviewPage, overviewPageCtx, 'overview')

import FetchPage from '../../components/fetchPage';
import fetchPageCtx from '../../controllers/fetchPage';
connect(FetchPage, fetchPageCtx, 'fetch');

import ParsePage from '../../components/parsePage';
import parsePageCtx from '../../controllers/parsePage';
connect(ParsePage, parsePageCtx, 'parse');

import StatusPage from '../../components/statusPage';
import statusPageCtx from '../../controllers/statusPage';
connect(StatusPage, statusPageCtx, 'status');

import CreateNewTaskDialog from '../../components/dialogs/createNewTask';
import createNewTaskDialogCtx from '../../controllers/dialogs/createNewTask';
connect(CreateNewTaskDialog, createNewTaskDialogCtx, 'createNewTaskDialog');

import FetchConfigDialog from '../../components/dialogs/fetchConfig';
import fetchConfigDialogCtx from '../../controllers/dialogs/fetchConfig';
connect(FetchConfigDialog, fetchConfigDialogCtx, 'fetchConfigDialog');

import ParseConfigDialog from '../../components/dialogs/parseConfig';
import parseConfigDialogCtx from '../../controllers/dialogs/parseConfig';
connect(ParseConfigDialog, parseConfigDialogCtx, 'parseConfigDialog');

import AboutDialog from '../../components/dialogs/about';
import aboutDialogCtx from '../../controllers/dialogs/about';
connect(AboutDialog, aboutDialogCtx, 'aboutDialog');

register(
  window.__NICKELCAT_INIT__.pageType,
  window.__NICKELCAT_INIT__.pagePreloadState,
  '$page'
);

hydrate(buildRootNode(
  RootComponent,
  RootController,
  window.__NICKELCAT_INIT__ || {}
), document.querySelector('#root'));

const ssrStyles = document.querySelector('#ssr-css');
if (ssrStyles) {
  ssrStyles.parentElement.removeChild(ssrStyles);
}
