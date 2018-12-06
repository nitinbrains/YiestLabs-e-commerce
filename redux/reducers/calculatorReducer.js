import { createReducer } from '../../helpers/reduxHelpers';
import { calculatorTypes } from '../actions/calculatorActions';

const initialState = {
    error: null,
    isLoading: false,
    showResult: false,
    result: {},
};


export default createReducer(initialState, {
    [calculatorTypes.START_CALCULATE_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [calculatorTypes.START_CALCULATE_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        showResult: true,
        result: {'summary': {}, 'items':[{},{},{},{},{},{},{}] }
    }),
    [calculatorTypes.START_CALCULATE_FAILURE]: (state, { data }) => ({
        isLoading: false,
        result: []
    }),
    [calculatorTypes.CLOSE_DIALOG_ATTEMPT]: (state, { data }) => ({
        showResult: false,
    }),
});
