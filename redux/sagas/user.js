import { put, call, select } from 'redux-saga/effects';
import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _get from 'lodash/get';

import { userActions } from 'appRedux/actions/userActions';
import { messageActions } from 'appRedux/actions/messageActions';
import { orderActions } from "appRedux/actions/orderActions";

import * as api from 'services/user.js';
import { prepareUserInfo } from 'lib/UserUtils.js';
import { uuid } from 'lib/Utils.js';

import WLHelper from 'lib/WLHelper';

export function* loginUser(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { username, password }
    } = action;
    try {
        const { res, error } = yield call(api.login, username, password);

        if (error) throw error;
        let { userID } = res;
        if (res.error && res.error.code === 0) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: res.error.message,
                    variant: "error"
                })
            );
        } else if (!_isEmpty(userID)) {
            userID = Number(userID);
            yield put(userActions.getUserInfo({ userID, isLogin: true }));
        } else {
            yield put(
                messageActions.showBanner({
                    title: "Error",
                    message: "Something went wrong",
                    variant: "error"
                })
            );
        }
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* getUserInfo(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { userID, isLogin }
    } = action;
    try {
        const { res: userInfo, error } = yield call(api.getUserInfo, { userID });

        if (error) throw error;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        yield put(userActions.setUserInfo({ userInfo }));
        yield put(responseSuccess());
        if (isLogin) {
            yield put(
                messageActions.showBanner({
                    title: "Authorization",
                    message: "You have successfully logged in!",
                    variant: "success"
                })
            );
        }
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setUserInfo(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { userInfo }
    } = action;
    try {
        prepareUserInfo(userInfo);
        yield put(responseSuccess(userInfo));
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* updateUserInfo(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { request }
    } = action;
    try {
        const user = yield select(state => state.user);

        request.id = user.id;

        var { res, error } = yield call(api.updateUserInfo, {
            request
        });

        yield put(responseSuccess(request));

        if (error) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "Error: error updating your account" + error,
                    variant: "error"
                })
            );
            throw error;
        } else {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "Your account information has been successfully updated",
                    variant: "success"
                })
            );
        }

        yield put(
            userActions.getUserInfo({
                userID: user.id
            })
        );
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* createUser(action) {
    const { responseSuccess, responseFailure, data } = action;

    try {
        var request = Object.assign({}, data);
        request.creditToken = WLHelper.generateCreditToken(data.card);
        request.nonce = uuid();

        const res = yield call(api.createNetSuiteAccount, { request });
        if (res.error) throw error;
        request = {};
        request.id = res.id;
        const { res: { result }, error } = yield call(api.createYeastmanAccount, { request });
        yield put(responseSuccess());
        if (res.error) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "Error creating account",
                    variant: "error"
                })
            );
            throw error;
        } else {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "Your account has been successfully created",
                    variant: "success"
                })
            );
        }
        yield put(userActions.setUserInfo({ userInfo }));
    } catch (error) {
        yield put(
            messageActions.showBanner({
                title: "Yeastman",
                message: "Error creating account",
                variant: "error"
            })
        );

        if (error && error.status) {
            // show network error is any regaring with api status
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "Network Failure ",
                    variant: "error"
                })
            );
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error && error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error && error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error && error));
    }
}

export function* changeSubsidiary(action) {
    const { responseSuccess, responseFailure, data: { subsidiary }} = action;
    try {
        const user = yield select(state => state.user);

        const account = _find(user.connectedaccounts, {subsidiaryid: subsidiary});
        const internalid = _get(account, 'internalid');

        yield put(userActions.getUserInfo({userID: internalid}));

    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* addSubsidiary(action) {
    const { responseSuccess, responseFailure, data: { subsidiary }} = action;
    try {
        const user = yield select(state => state.user);
        const account = _find(user.connectedaccounts, {subsidiaryid: 2});
        const internalid = _get(account, 'internalid');
        if (!internalid) throw { message: "User does not have a White Labs Inc account", code: 0}

        let request = {};
        request.addSubsidiary = true;
        request.subsidiary = subsidiary;
        request.id = internalid;
        request.vat = user.vat;
        request.category = user.category;

        var { res: { id }, error } = yield call(api.addSubsidiary, { request });

        if (error) throw error;

        yield put(userActions.getUserInfo({userID: id}));

    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* getOrderHistory(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            throw { message: "No user id. Cannot get order history", code: 0 };
        }

        var request = {};
        request.id = user.id;

        var {
            res: { orderHistory },
            error
        } = yield call(api.getOrderHistory, { request });
        if (error) throw error;

        yield put(responseSuccess({ orderHistory }));
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* forgotPassword(action) {
    const { 
        responseSuccess, 
        responseFailure,
        data: { email }
    } = action;
    try {
        let request = {};
        request.email = email;

        const {
            res,
            error
        } = yield call(api.forgotPassword, { request });

        if (error) {
            throw error;
        } else if (res.error) {
            throw res.error;
        } else {
            yield put(messageActions.showBanner({ title: "Success", message: "Your password has been reset. Please watch your email for your new password.", variant: "success" }));
        }
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}


export function* changePassword(action) {
    const { 
        responseSuccess, 
        responseFailure,
        data: { newPassword }
    } = action;
    try {
        const user = yield select(state => state.user);

        let request = {};
        request.newPassword = newPassword;
        request.user = user;

        var {
            res,
            error
        } = yield call(api.changePassword, { request });

        if (error) throw error;

        yield put(responseSuccess());

    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setShipMethod(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { shipmethod }
    } = action;
    try {
        yield put(responseSuccess({shipmethod}));
        yield put(orderActions.prepareOrder());
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

/*************************/
/* Credit Card Functions */
/*************************/

export function* addCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot add credit card",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot add credit card", code: 0 };
        }

        let request = {};
        request.addCreditCard = true;
        request.token = WLHelper.generateCreditToken(creditCard);

        yield put(userActions.updateUserInfo({ request }));
        yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* deleteCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot delete credit card",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot delete credit card", code: 0 };
        }

        let request = {};
        request.deleteCreditCard = true;
        request.card = creditCard;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        yield put(responseSuccess({ creditCard }));
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setDefaultCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            throw { message: "No user id. Cannot set default card", code: 0 };
        }

        // Update default card in NetSuite
        let request = {};
        request.defaultCreditCard = true;
        request.card = creditCard;
        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* General Address Functions */
/*****************************/

export function* addAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;

    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot add Address",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot add Address", code: 0 };
        }

        let request = {};
        request.addAddress = true;
        request.address = address;
        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function* editAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot edit Address",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot edit address", code: 0 };
        }

        let request = {};
        request.editAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* deleteAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot delete Address",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot delete Address", code: 0 };
        }

        let request = {};
        request.deleteAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/******************************/
/* Shipping Address Functions */
/******************************/

export function* setShipAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        yield put(responseSuccess({ address }));

        const user = yield select(state => state.user);
        user.shipping = address;
        yield put(orderActions.prepareOrder());
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setDefaultShipAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot set default ship address",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot set default ship address", code: 0 };
        }

        let request = {};
        request.defaultShipAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* Billing Address Functions */
/*****************************/

export function* setBillAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        yield put(responseSuccess({ address }));

        const user = yield select(state => state.user);
        user.billing = address;
        yield put(orderActions.prepareOrder());
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setDefaultBillAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(
                messageActions.showBanner({
                    title: "Yeastman",
                    message: "No user id. Cannot set default bill address",
                    variant: "error"
                })
            );
            throw { message: "No user id. Cannot set default bill address", code: 0 };
        }

        let request = {};
        request.id = user.id;
        request.defaultBillAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

//Feedback saga function
export function* addFeedback(action) {
    const {
        responseSuccess,
        responseFailure,
        data
    } = action;
    try {
        const { res, error } = yield call(api.feedback, data); //api not available 
        yield put(responseSuccess());

        if (error) {
            throw error;
        } else if (res.error) {
            throw res.error;
        } else {
            yield put(messageActions.showBanner({ title: "Success", message: "Your Feedback has been successfully submitted", variant: "success" }));
        }
    } catch (error) {
        if (error.status) {
            // show network error is any regaring with api status
            yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
        } else {
            if (error.code == 0) {
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: "Yeastman", message: error.message, variant: "error" }));
            } else if (error.code == -1) {
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: "Error", message: error.message, variant: "error" }));
            }
        }
        yield put(responseFailure(error));
    }
}