import { requestWrapper } from './base';

export const getUserInfo = (userID) => requestWrapper(`/get-user-info`, {
    query: {
        userID,
    }
});

export const login = (username, password) => requestWrapper(`/get-user-id`, {
    query: {
        username,
        password
    }
});
