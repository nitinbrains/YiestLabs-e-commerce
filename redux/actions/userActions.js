import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { userTypes, userActions } = createActionsStructure('user', [
  { name: 'USER_LOGIN', async: true },
  { name: 'GET_USER_INFO', async: true },
  { name: 'SET_USER_INFO', async: true },
  { name: 'UPDATE_USER_INFO', async: true },
  { name: 'SET_SHIP_METHOD', async: true },
  { name: 'ADD_CREDIT_CARD', async: true },
  { name: 'DELETE_CREDIT_CARD', async: true },
  { name: 'SET_CREDIT_CARD', async: true },
  { name: 'SET_DEFAULT_CARD', async: true },
  { name: 'ADD_ADDRESS', async: true },
  { name: 'EDIT_ADDRESS', async: true },
  { name: 'DELETE_ADDRESS', async: true },
  { name: 'SET_SHIP_ADDRESS', async: true },
  { name: 'SET_DEFAULT_SHIP_ADDRESS', async: true },
  { name: 'SET_BILL_ADDRESS', async: true },
  { name: 'SET_DEFAULT_BILL_ADDRESS', async: true },
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
