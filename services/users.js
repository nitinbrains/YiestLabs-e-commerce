import { requestWrapper } from './base';

export const getUserInfo = (userID) => requestWrapper(`/get-user-info`, {
    method: "POST",
    body: JSON.stringify(userID)
});

export const login = (username, password) => requestWrapper(`/get-user-id`, {
    method: "POST",
    body: JSON.stringify({username, password})
});

export const updateUserInfo = (userInfo) => requestWrapper('/update-user-info', {
    method: "POST",
    body: JSON.stringify(userInfo)
});

export const getOrderHistory = (userInfo) => requestWrapper('/get-order-history', {
    method: "POST",
    body: JSON.stringify(userInfo)
});