import { createReducer } from '../../helpers/reduxHelpers';
import { userTypes } from '../actions/userActions';

/* ------------- Initial State ------------- */

export const initialState = {} // empty for now

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
  [userTypes.USER_LOGIN_SUCCESS]: ({ auth }, { data }) => ({
    ...data
  }),
  [userTypes.USER_LOGIN_FAILURE]: ({ auth }, { data }) => null, // this will return initial state
  [userTypes.USER_LOGOUT]: ({ register }, { data }) => null,    // this will return initial state
})
