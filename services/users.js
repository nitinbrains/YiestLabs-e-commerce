import { requestWrapper } from './base';

export const getUserInfo = (userId) => requestWrapper(`/get-user-info`, {
    query: {
        userId,
    }
});

export const login = (username, password) => requestWrapper(`/get-user-id`, {
    query: {
        username,
        password
    }
});
