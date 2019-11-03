import { handleActions } from 'redux-actions';
import types from './actionTypes';

const initialState = {
  views: {
    activeStep: 0,
    drawerOpen: false,

    aboutDialogOpen: false,
    loginDialogOpen: false,

    rootMode: false,
    loginState: 'ready'
  },
  pages: {
    step1: {
      grade: null,
      classId: null,
      warnNoGradeOrClassDialogOpen: false
    },
    step2: {
      studentList: [],
      addMemberDialogOpen: false
    },
    step3: {
      submitState: 'ready',
      fetchLatestState: 'ready',
      fetchLatestList: [],
    }
  }
};

export default handleActions({
  [types.increaseStep]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        activeStep: state.views.activeStep + 1
      }
    }),
    throw: state => state
  },
  [types.decreaseStep]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        activeStep: state.views.activeStep - 1
      }
    }),
    throw: state => state
  },
  [types.backToHeadStep]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        activeStep: 0
      }
    }),
    throw: state => state
  },

  [types.openDrawer]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        drawerOpen: true
      }
    }),
    throw: state => state
  },
  [types.closeDrawer]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        drawerOpen: false
      }
    }),
    throw: state => state
  },

  [types.openAboutDialog]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        aboutDialogOpen: true
      }
    }),
    throw: state => state
  },
  [types.closeAboutDialog]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        aboutDialogOpen: false
      }
    }),
    throw: state => state
  },

  [types.openLoginDialog]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        loginDialogOpen: true
      }
    }),
    throw: state => state
  },
  [types.closeLoginDialog]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        loginDialogOpen: false
      }
    }),
    throw: state => state
  },
  [types.setLoginState]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        loginState: action.payload
      }
    }),
    throw: state => state
  },
  [types.setRootMode]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        rootMode: true
      }
    }),
    throw: state => state
  },
  [types.quitRootMode]: {
    next: (state, action) => ({
      ...state,
      views: {
        ...state.views,
        rootMode: false
      }
    }),
    throw: state => state
  },

  [types.step1.selectGrade]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step1: {
          ...state.pages.step1,
          grade: action.payload
        }
      }
    }),
    throw: state => state
  },
  [types.step1.selectClass]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step1: {
          ...state.pages.step1,
          classId: action.payload
        }
      }
    }),
    throw: state => state
  },
  [types.step1.setWarnNoGradeOrClassDialog]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step1: {
          ...state.pages.step1,
          warnNoGradeOrClassDialogOpen: action.payload
        }
      }
    }),
    throw: state => state
  },

  [types.step2.openAddMemberDialog]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step2: {
          ...state.pages.step2,
          addMemberDialogOpen: true
        }
      }
    }),
    throw: state => state
  },
  [types.step2.closeAddMemberDialog]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step2: {
          ...state.pages.step2,
          addMemberDialogOpen: false
        }
      }
    }),
    throw: state => state
  },
  [types.step2.submitAndCloseDialog]: {
    next: (state, action) => {
      let studentList = state.pages.step2.studentList;
      studentList.push({
        ...action.payload
      });
      return {
        ...state,
        pages: {
          ...state.pages,
          step2: {
            ...state.pages.step2,
            addMemberDialogOpen: true,
            studentList
          }
        }
      }
    },
    throw: state => state
  },
  [types.step2.deleteMember]: {
    next: (state, action) => {
      let studentList = Array.prototype.slice.call(state.pages.step2.studentList);
      studentList.splice(action.payload, 1);
      return {
        ...state,
        pages: {
          ...state.pages,
          step2: {
            ...state.pages.step2,
            studentList
          }
        }
      }
    },
    throw: state => state
  },

  [types.step3.changeState]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step3: {
          ...state.pages.step3,
          submitState: action.payload
        }
      }
    }),
    throw: state => state
  },
  [types.step3.updateLatestList]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step3: {
          ...state.pages.step3,
          fetchLatestList: action.payload
        }
      }
    }),
    throw: state => state
  },
  [types.step3.updateLatestListState]: {
    next: (state, action) => ({
      ...state,
      pages: {
        ...state.pages,
        step3: {
          ...state.pages.step3,
          fetchLatestState: action.payload
        }
      }
    }),
    throw: state => state
  }
}, initialState);
