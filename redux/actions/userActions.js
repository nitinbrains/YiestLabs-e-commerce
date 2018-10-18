import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { userTypes, userActions } = createActionsStructure('user', [
  { name: 'USER_LOGIN', async: true },
  { name: 'USER_LOGOUT' }
]);

// -- uncomment to display
// console.log(userTypes, userActions)

/*
--- expected result types for async
  USER_LOGIN_ATTEMPT: 'user.USER_LOGIN_ATTEMPT',
  USER_LOGIN_SUCCESS: 'user.USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE: 'user.USER_LOGIN_FAILURE',

--- expected result types for default
  USER_LOGOUT_ATTEMPT: 'user.USER_LOGOUT_ATTEMPT'

--- expected result action for async
  userLogin function with { type, responseSuccess, responseFailure, data }

--- expected result action for default
  userLogout function with { type, data }
*/
