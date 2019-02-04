import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';
import { finished } from 'stream';
import {find} from 'lodash';

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
    [messageTypes.DISPLAY_MESSAGE_ATTEMPT]: (state, { data: { displayType, title, message, error, variant, anchorOrigin } }) =>{
        console.log(error,message,variant,title,'to display error message message')
        let type = getType(message, error);
        // check duplicate message
        if(!find(state.messages, (err)=>{ return err.type === type && err.variant === variant && (err.message === message || err.message === error)})){
            return({
                messages: [
                    ...state.messages,
                    {
                        index: state.messages.length,
                        type,
                        displayType,
                        title,
                        message: message || error,
                        variant: variant,
                        anchorOrigin,
                    }
                ] 
            })
        }else{
            return {...state}
        }
    },
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => message.index !== idx.index)
    }),
    [messageTypes.SHOW_NETWORK_ERROR_ATTEMPT]: (state, { data:{ displayType, title, message, error, variant, anchorOrigin } }) =>{ 
        console.log(title,message,error,'error message if any')
        let type = getType(message, error);
        // check duplicate message
        let mes = find(state.networkRequestError, (err)=>{return  err.type === type && err.variant === variant && (err.message === message || err.message === error)})
        if(!mes){
            return({
                networkRequestError: [
                    ...state.networkRequestError,
                    {
                        index: state.networkRequestError.length,
                        type,
                        displayType,
                        title,
                        message: message || error,
                        variant: variant,
                        anchorOrigin,
                    }
                ] 
            })
        }else{
            return {...state}
        }
    },
    [messageTypes.HIDE_NETWORK_ERROR_ATTEMPT]: ({networkRequestError}, {data: idx} ) => ({
        networkRequestError: networkRequestError.filter((error, index) => error.index !== idx.index)
    }),
});
