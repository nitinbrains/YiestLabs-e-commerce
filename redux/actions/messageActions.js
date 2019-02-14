import { createActionsStructure } from 'helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { messageTypes, messageActions } = createActionsStructure('message', [
  { name: 'SHOW_BANNER' },
  { name: 'HIDE_BANNER' },
  { name: 'SHOW_SNACKBAR' },
  { name: 'HIDE_SNACKBAR' },
]);
