export const RESET_STORE = 'RESET_STORE_ATTEMPT';

const isObject = (o) => o instanceof Object || o == null;

export const createReducer = (initialState, handlers, allowReset = true, finalizer = x => x) =>
  (state = initialState, action) => {
    if (allowReset && action.type === RESET_STORE) return initialState;

    if (action.type) {
      const handler = handlers[action.type];

      if (handler) {
        const result = handler(state, action);
        if (result === null) {
          return initialState;
        }
        if (Object.keys(result).length === 0 && result.constructor === Object) {
          return result;
        }
        return finalizer({ ...state, ...result })
      }
    }
    return state
  };

export const createActionsStructure = (prefix, protoArray) => {
  const { types, actions } = protoArray.reduce(({ types, actions }, { name, async }) => {
    const nameSplitted = name.split('_');
    const upperName = name.toUpperCase();

    // types creator
    const actionTypesNames = [`${upperName}_ATTEMPT`, `${upperName}_SUCCESS`, `${upperName}_FAILURE`];
    const actionTypesValues = [
      `${prefix}.${upperName}_ATTEMPT`,
      `${prefix}.${upperName}_SUCCESS`,
      `${prefix}.${upperName}_FAILURE`
    ];
    const actionTypes = async
      ? {
        [actionTypesNames[0]]: actionTypesValues[0],
        [actionTypesNames[1]]: actionTypesValues[1],
        [actionTypesNames[2]]: actionTypesValues[2]
      }
      : {
        [actionTypesNames[0]]: actionTypesValues[0]
      };
    // actions creator
    const actionPrimaryName = nameSplitted.slice(1).reduce((name, word) =>
      `${name}${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`, nameSplitted[0].toLowerCase())
    const actionCreators = async
      ? {
        [actionPrimaryName]: (data) => ({
          type: actionTypesValues[0],
          responseSuccess: (dataSuccess) => ({ type: actionTypesValues[1], data: dataSuccess }),
          responseFailure: (dataFailure) => ({ type: actionTypesValues[2], data: dataFailure }),
          data: isObject(data) ? { ...data } : data
        })
      }
      : {
        [actionPrimaryName]: (data) => ({
          type: actionTypesValues[0],
          data: { ...data }
        })
      };
    return {
      types: {
        ...types,
        ...actionTypes
      },
      actions: {
        ...actions,
        ...actionCreators
      }
    }
  }, { types: {}, actions: {} });
  return {
    [`${prefix}Types`]: types,
    [`${prefix}Actions`]: actions
  }
};
