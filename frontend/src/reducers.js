import { SET_DOCTOR_ID } from './actions';

const initialState = {
  doctorId: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DOCTOR_ID:
      return {
        ...state,
        doctorId: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
