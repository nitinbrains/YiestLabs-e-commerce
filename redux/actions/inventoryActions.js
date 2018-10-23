import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { inventoryTypes, inventoryActions } = createActionsStructure('inventory', [
  { name: 'GET_INVENTORY', async: true },
]);
