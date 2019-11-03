import types from './actionTypes';
import { createAction } from 'redux-actions';

const actions = {
  increaseStep: createAction(types.increaseStep),
  decreaseStep: createAction(types.decreaseStep),
  backToHeadStep: createAction(types.backToHeadStep),

  openDrawer: createAction(types.openDrawer),
  closeDrawer: createAction(types.closeDrawer),

  openAboutDialog: createAction(types.openAboutDialog),
  closeAboutDialog: createAction(types.closeAboutDialog),

  openLoginDialog: createAction(types.openLoginDialog),
  closeLoginDialog: createAction(types.closeLoginDialog),
  loginRoot: (name, password) => (dispatch, getState) => {
    dispatch(actions.setLoginState('loading'));
      fetch('/api/loginRootAccount', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, password
        })
      }).then(res => res.json()).then(json => {
        if(json.state === 'success') {
          dispatch(actions.setLoginState('success'));
          dispatch(actions.setRootMode(true));
          dispatch(actions.closeLoginDialog());
        } else {
          dispatch(actions.setLoginState('fail'));
          dispatch(actions.closeLoginDialog());
        }
      }).catch(err => {
        console.log(err);
        dispatch(actions.setLoginState('fail'));
      });
  },
  setLoginState: createAction(types.setLoginState),
  setRootMode: createAction(types.setRootMode),
  quitRootMode: createAction(types.quitRootMode),

  step1: {
    selectGrade: createAction(types.step1.selectGrade, grade => grade),
    selectClass: createAction(types.step1.selectClass, classId => classId),
    setWarnNoGradeOrClassDialog: createAction(types.step1.setWarnNoGradeOrClassDialog, isOpen => isOpen)
  },
  step2: {
    openAddMemberDialog: createAction(types.step2.openAddMemberDialog),
    closeAddMemberDialog: createAction(types.step2.closeAddMemberDialog),
    submitAndCloseDialog: createAction(types.step2.submitAndCloseDialog,
      (name, sex, reason) => ({name, sex, reason})),
    deleteMember: createAction(types.step2.deleteMember, id => id)
  },
  step3: {
    submitList: () => (dispatch, getState) => {
      dispatch(actions.step3.changeState('loading'));
      fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          list: getState().pages.step2.studentList,
          grade: getState().pages.step1.grade,
          classId: getState().pages.step1.classId
        })
      }).then(res => res.json()).then(json => {
        dispatch(actions.step3.changeState(json.state));
        dispatch(actions.step3.fetchList());
      }).catch(err => {
        console.log(err);
        dispatch(actions.step3.changeState('fail'));
      });
    },
    fetchList: () => (dispatch, getState) => {
      dispatch(actions.step3.updateLatestListState('loading'));
      fetch('/api/getLatestList', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(json => {
        dispatch(actions.step3.updateLatestListState(json.state));
        dispatch(actions.step3.updateLatestList(json.list));
      }).catch(err => {
        console.log(err);
        dispatch(actions.step3.updateLatestListState('fail'));
      });
    },
    changeState: createAction(types.step3.changeState, state => state),
    updateLatestList: createAction(types.step3.updateLatestList, list => list),
    updateLatestListState: createAction(types.step3.updateLatestListState, state => state)
  }
};

export default actions;
