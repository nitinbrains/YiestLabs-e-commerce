import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { orderTypes, orderActions } = createActionsStructure('order', [
  { name: 'PREPARE_ORDER', async: true },
  { name: 'PLACE_ORDER', async: true },
  { name: 'SET_SHIPPING_OPTION', async: true },
  { name: 'INCREMENT_SHIP_DATE', async: true },
  { name: 'DECREMENT_SHIP_DATE', async: true },
  { name: 'SET_ITEMS' },
]);
