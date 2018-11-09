import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { orderTypes, orderActions } = createActionsStructure('order', [
  { name: 'PREPARE_ORDER', async: true },
]);
