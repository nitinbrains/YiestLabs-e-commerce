import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';
import { finished } from 'stream';

const initialState = {
    messages: [],
    networkRequestError: []
};

const defaultConfig = {
    anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
    disableAutoHide: false
}
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
    [messageTypes.DISPLAY_MESSAGE_ATTEMPT]: ({ messages }, { data: { title, message, error, variant, anchorOrigin, disableAutoHide } }) =>{
        console.log(error,message,variant,title,'to display error message message')
        let newMessage = {
            ...defaultConfig,
            type: getType(message, error),
            title,
            message: message || error,
            variant: variant
        }
        if(anchorOrigin) newMessage.anchorOrigin = anchorOrigin
        if(disableAutoHide) newMessage.disableAutoHide = disableAutoHide
        return ({
        messages: [
            ...messages,
            newMessage
        ]
    })},
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => index !== idx)
    }),
    [messageTypes.SHOW_NETWORK_ERROR_ATTEMPT]: (state, { data:{ title, message, error, variant, anchorOrigin, disableAutoHide } }) =>{ 
        console.log(title,message,error,'error message if any')

        find()
        let newNetworkRequestError = {
            ...defaultConfig,
            type: getType(message, error),
            title,
            message: message || error,
            variant: variant
        }
        if(anchorOrigin) newNetworkRequestError.anchorOrigin = anchorOrigin
        if(disableAutoHide) newNetworkRequestError.disableAutoHide = disableAutoHide
        return({
        networkRequestError: [
            ...state.networkRequestError,
            newNetworkRequestError
        ] 
    })},
    [messageTypes.HIDE_NETWORK_ERROR_ATTEMPT]: (state, data ) =>{
        let message = state.networkRequestError;
        message.pop();
        return ({
            networkRequestError: message
    })},
});
