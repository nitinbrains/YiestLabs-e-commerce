import { requestWrapper } from './base';

export const prepareOrder = (params) => requestWrapper(`/prepare-order`, {
    method: "POST",
    body: JSON.stringify(params)
});
