import { runSaga, storeIO } from 'redux-saga';
import { put, select, delay } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import fetchMock from 'fetch-mock';
import nodeFetch from 'node-fetch';

nodeFetch.default = fetchMock;

import {
    loginUser,
    setUserInfo,
    setCreditCard,
    addCreditCard,
    setShipMethod,
    setShipAddress,
    setBillAddress,
    addShipAddress,
    addBillAddress
} from '../users';
import { userActions } from '../../actions/userActions';
import { messageActions } from '../../actions/messageActions';
import Utils from '../../../lib/Utils';
import { user } from '../../mocks';

const userId = 123;
const address = {
    addresee: "",
    address1: "test",
    address2: "test",
    address3: "test",
    addressee: "test",
    attn: "test",
    city: "Oregon",
    countryid: "US",
    id: 1,
    zip: "12000",
};


describe('testing of users sagas', () => {
    it('login user', () => {
        fetchMock.mock('begin:http://localhost:3000/get-user-id', `${userId}`);
        fetchMock.get('begin:http://localhost:3000/get-user-info', user);

        const action = userActions.userLogin({ username: 'test', password: 'password' });
        const userToCheck = {
            ...user,
            shipMethods: Utils.shipMethodGroup(user)
        }
        return expectSaga(
            loginUser, action
        ).withState({}).put(
            action.responseSuccess(userToCheck)
        ).put.like(
            { action: { type: 'user.SET_CREDIT_CARD_ATTEMPT', data: 0 } }
        ).put(
            messageActions.displayMessage({
                title: 'Authorization',
                message: 'You have successfully logged in!'
            })
        ).run();
    });

    it('set user info', () => {
        const action = userActions.setUserInfo({ userInfo: user });
        return expectSaga(
            setUserInfo, action
        ).withState({
            user
        }).put(
            action.responseSuccess(user)
        ).run();
    });

    it('set credit card', () => {
        const action = userActions.setCreditCard(0);
        return expectSaga(
            setCreditCard, action
        ).withState({
            user
        }).put(
            action.responseSuccess({
                ...user,
                selectedCard: user.cards[0]
            })
        ).run();
    });

    it('add credit card', () => {
        const today = new Date()
        today.setYear(today.getFullYear() + 1);
        const currentMonth = today.getMonth().toString();
        const currentYear = today.getFullYear().toString();
        const newCard = {
            name: 'visa test',
            number: '4111111111111111',
            expireMonth: currentMonth,
            expireYear: currentYear,
        };
        const action = userActions.addCreditCard(newCard);
        return expectSaga(
            addCreditCard, action
        ).withState({
            user
        }).put(
            action.responseSuccess({
                cards: [
                    ...user.cards,
                    { ...newCard, id: 1 }
                ],
                creditCard: { ...newCard, id: 1 }
            })
        ).run();
    });

    it('set ship method', () => {
        const action = userActions.setShipMethod(0);
        return expectSaga(
            setShipMethod, action
        ).withState({
            user
        }).put(
            action.responseSuccess(0)
        ).run();
    });

    it('set ship address', () => {
        const action = userActions.setShipAddress(user.otherAddresses[0]);
        return expectSaga(
            setShipAddress, action
        ).withState({
            user
        }).put(
            action.responseSuccess(user.otherAddresses[0])
        ).run();
    });

    it('add ship address', () => {
        const action = userActions.addShipAddress(address);
        return expectSaga(
            addShipAddress, action
        ).withState({
            user
        }).put(
            action.responseSuccess({
                otherAddresses: [
                    ...user.otherAddresses,
                    address
                ],
                shipping: { ...address, id: 1 }
            })
        ).run();
    });

    it('set bill address', () => {
        const action = userActions.setBillAddress(user.otherAddresses[0]);
        return expectSaga(
            setBillAddress, action
        ).withState({
            user
        }).put(
            action.responseSuccess(user.otherAddresses[0])
        ).run();
    });

    it('add bill address', () => {
        const action = userActions.addBillAddress(address);
        return expectSaga(
            addBillAddress, action
        ).withState({
            user
        }).put(
            action.responseSuccess({
                otherAddresses: [
                    ...user.otherAddresses,
                    address
                ],
                billing: { ...address, id: 1 }
            })
        ).run();
    });
})
