import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';
import { finished } from 'stream';
import {find} from 'lodash';

const initialState = {
    banner: [],
    snackbar: [],
};


export default createReducer(initialState, {
    [messageTypes.SHOW_BANNER_ATTEMPT]: (state, { data:{ title, message, variant, timeOut } }) =>{
        // check duplicate message
        let msgText = message.message || message;
        let mes = find(state.banner, (err)=>{return  err.title === title && err.variant === variant && err.message === msgText})
        if(!mes){
            return({
                banner: [
                    ...state.banner,
                    {
                        index: state.banner.length,
                        title,
                        message: msgText,
                        variant,
                        timeOut,
                    }
                ] 
            })
        }else{
            return {...state}
        }
    },
    [messageTypes.HIDE_BANNER_ATTEMPT]: ({banner}, {data: idx} ) => ({
        banner: banner.filter((error, index) => error.index !== idx.index)
    }),
    [messageTypes.SHOW_SNACKBAR_ATTEMPT]: (state, { data:{ title, message, variant, anchorOrigin } }) =>{ 
        // check duplicate message
        let msgText = message.message || message;
        let mes = find(state.snackbar, (err)=>{return  err.title === title && err.variant === variant && err.message === msgText})
        if(!mes){
            return({
                snackbar: [
                    ...state.snackbar,
                    {
                        index: state.snackbar.length,
                        title,
                        message: msgText,
                        variant,
                        anchorOrigin,
                    }
                ] 
            })
        }else{
            return {...state}
        }
    },
    [messageTypes.HIDE_SNACKBAR_ATTEMPT]: ({snackbar}, {data: idx} ) => ({
        snackbar: snackbar.filter((error, index) => error.index !== idx.index)
    }),
});
