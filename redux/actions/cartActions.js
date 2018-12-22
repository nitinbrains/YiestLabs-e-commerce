import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { cartTypes, cartActions } = createActionsStructure('cart', [
  { name: 'ADD_ITEM', async: true },
  { name: 'UPDATE_ITEM', async: true },
  { name: 'REMOVE_ITEM', async: true },
  { name: 'CLEAR_CART' },
  { name: 'SHOW_WANT_SOONER', async: true},
  { name: 'HIDE_WANT_SOONER', async: true},
]);
