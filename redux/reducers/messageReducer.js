import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';

const initialState = {
    messages: [],
    networkRequestError: []
};
const defaultAnchorOrigin = {vertical: 'bottom', horizontal: 'right'}
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
        return ({
        messages: [
            ...messages,
            {
                type: getType(message, error),
                title,
                message: message || error,
                variant: variant,
                anchorOrigin:anchorOrigin || defaultAnchorOrigin
            }
        ]
    })},
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => index !== idx)
    }),
    [messageTypes.SHOW_NETWORK_ERROR_ATTEMPT]: (state, { data:{ title, message, error, variant, anchorOrigin } }) =>{ 
        console.log(title,message,error,'error message if any')
        return({
        networkRequestError: [
            ...state.networkRequestError,
            {
                type : getType(message,error),
                title : title,
                message: message || error,
                variant: variant,
                anchorOrigin:anchorOrigin || defaultAnchorOrigin
            }
        ] 
    })},
    [messageTypes.HIDE_NETWORK_ERROR_ATTEMPT]: (state, data ) =>{
        let message = state.networkRequestError;
        message.pop();
        return ({
            networkRequestError: message
    })},
});
