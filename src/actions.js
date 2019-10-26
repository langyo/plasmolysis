import types from './actionTypes';
import { createAction } from 'redux-actions';

const actions = {
  increaseStep: createAction(types.increaseStep),
  decreaseStep: createAction(types.decreaseStep),
  backToHeadStep: createAction(types.backToHeadStep),
  step1: {
    selectGrade: createAction(types.step1.selectGrade, grade => grade),
    selectClass: createAction(types.step1.selectClass, classId => classId)
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
          list: getState().studentList,
          grade: getState().grade,
          classId: getState().classId
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
