import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { messageTypes, messageActions } = createActionsStructure('message', [
  { name: 'DISPLAY_MESSAGE' },
  { name: 'HIDE_MESSAGE' },
  { name: 'SHOW_NETWORK_ERROR' },
  { name: 'HIDE_NETWORK_ERROR' }
]);
