import messageReducer from '../messageReducer';
import { messageTypes } from '../../actions/messageActions';
import { message } from '../../mocks';


describe('testing of message reducer', () => {
    it('display message attempt add new message to state', () => {
        return expect(messageReducer(message, {
            type: messageTypes.DISPLAY_MESSAGE_ATTEMPT,
            data: {
                title: 'message',
                message: 'simple message',
            }
        })).toEqual({
            messages: [{
                type: 'NOTIFICATION',
                title: 'message',
                message: 'simple message',
            }]
        })
    });

    it('display message attempt add error message to state', () => {
       return expect(messageReducer(message, {
            type: messageTypes.DISPLAY_MESSAGE_ATTEMPT,
            data: {
                title: 'error title',
                error: 'error message',
            }
        })).toEqual({
            messages: [{
                type: 'ERROR',
                title: 'error title',
                message: 'error message',
            }]
        })
    });

    it('hide message attempt add remove message from state', () => {
        expect(messageReducer({ messages: [{ title: 'title', message: 'message' }],  }, {
            type: messageTypes.HIDE_MESSAGE_ATTEMPT,
            data: 0
        })).toEqual({
            messages: []
        })
    });
});
