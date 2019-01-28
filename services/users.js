import { requestWrapper } from './base';

export const getUserInfo = (params) => requestWrapper(`/get-user-info`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const login = (params) => requestWrapper(`/get-user-id`, {
    method: "POST",
    body: JSON.stringify(params)
});
