import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { orderTypes, orderActions } = createActionsStructure('order', [
  { name: 'PLACE_ORDER', async: true },
]);
