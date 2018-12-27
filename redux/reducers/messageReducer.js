import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';

const initialState = {
    messages: []
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
    [messageTypes.DISPLAY_MESSAGE_ATTEMPT]: ({ messages }, { data: { title, message, error } }) => ({
        messages: [
            ...messages,
            {
                type: getType(message, error),
                title,
                message: message || error
            }
        ]
    }),
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => index !== idx)
    }),
});
