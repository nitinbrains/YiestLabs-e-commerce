import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';
import { finished } from 'stream';
import uuid from 'uuid/v4';

const initialState = {
    messages: [],
    networkRequestError: []
};

const getType = (message, error) => {
    if (message != null) {
        return 'NOTIFICATION';
    } else if (error != null) {
        console.log('error message', error);
        return 'ERROR';
    }
    return 'UNDEFINED'
};

export default createReducer(initialState, {
    [messageTypes.DISPLAY_MESSAGE_ATTEMPT]: ({ messages }, { data: { title, message, error, variant, anchorOrigin } }) =>{
        console.log(error,message,variant,title,'to display error message message')
        // let newMessage = {
        //     id: uuid(),
        //     type: getType(message, error),
        //     title,
        //     message: message || error,
        //     variant: variant,
        //     anchorOrigin,
        // }
        return ({
        messages: [
            ...messages,
            {
                id: uuid(),
                type: getType(message, error),
                title,
                message: message || error,
                variant: variant,
                anchorOrigin,
            }
        ]
    })},
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => message.id !== idx)
    }),
    [messageTypes.SHOW_NETWORK_ERROR_ATTEMPT]: (state, { data:{ title, message, error, variant, anchorOrigin } }) =>{ 
        console.log(title,message,error,'error message if any')

        // find()
        // let newNetworkRequestError = {
        //     id: uuid(),
        //     type: getType(message, error),
        //     title,
        //     message: message || error,
        //     variant: variant,
        //     anchorOrigin,
        // }
        return({
        networkRequestError: [
            ...state.networkRequestError,
            {
                id: uuid(),
                type: getType(message, error),
                title,
                message: message || error,
                variant: variant,
                anchorOrigin,
            }
        ] 
    })},
    [messageTypes.HIDE_NETWORK_ERROR_ATTEMPT]: ({networkRequestError}, {data: idx} ) =>({
        networkRequestError: networkRequestError.filter((error, index) => error.id !== idx)
    }),
    // {
    //     let message = state.networkRequestError;
    //     message.pop();
    //     return ({
    //         networkRequestError: message
    // })},
});
