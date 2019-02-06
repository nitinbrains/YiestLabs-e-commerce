import { requestWrapper } from './base';

export const getInventory = () => requestWrapper(`/get-inventory`);

export const getItemAvailability = (params) => requestWrapper(`/get-item-availability`, {
    method: "POST",
    body: JSON.stringify(params)
});

