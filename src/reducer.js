import { handleActions } from 'redux-actions';
import types from './actionTypes';

const initialState = {
  views: {
    drawerOpen: false
  },
  pages: {
  }
};

export default handleActions({
  
}, initialState);
