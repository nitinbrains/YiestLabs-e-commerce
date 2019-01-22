import { requestWrapper } from './base';

export const getUserInfo = (userID) => requestWrapper(`/get-user-info`, {
    method: "POST",
    body: JSON.stringify(userID)
});

export const updateUserInfo = (userInfo) => requestWrapper('/update-user-info', {
    method: "POST",
    body: JSON.stringify(userInfo)
});

export const login = (username, password) => requestWrapper(`/get-user-id`, {
    query: {
        username,
        password
    }
});
