import {
  connect,
  initRoutes,
  getRoutes
} from '../server';
import { loadActionModel } from '../client';
import initState from '../../configs/initState';

import presetActionPackage from '../action-preset';
loadActionModel(presetActionPackage);

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

import extraConfigs from '../../configs';
initRoutes(extraConfigs);

import { router } from '../server';
import { childCreator } from './childProcessCreator';
import RootComponent from '../../components/index';
import rootController from '../../controllers/index';

import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';

childCreator(async ({
  type,
  payload,
  configs
}) => await router(type, payload, getRoutes(), {
  ...configs,
  ...extraConfigs,
  rootGuide: {
    rootComponent: RootComponent,
    rootController: rootController,
    initState,
    headProcessor: node => {
      const sheets = new ServerStyleSheets();
      const html = renderToString(sheets.collect(node));
      return {
        renderHTML: html,
        renderCSS: {
          'ssr-css': sheets.toString()
        }
      }
    }
  }
}));
