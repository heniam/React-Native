import * as ActionType from './ActionType';

export const comments = (state = {
          isLoading: true,
          errMess: null,
          comments: []
        }, action) => {

          switch(action.type){
            case ActionType.ADD_COMMENTS:
                return {...state, errMess:null, comments: action.payload};


            case ActionType.COMMENTS_FAILED:
                return {...state, errMess:action.payload, comments: []};

            default:
                return state;
          }
        }
