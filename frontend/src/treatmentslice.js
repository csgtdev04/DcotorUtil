import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  treatments: [],
};

const treatmentSlice = createSlice({
  name: 'treatment',
  initialState,
  reducers: {
    addTreatment: (state, action) => {
      state.treatments.push(action.payload);
    },
  },
});

export const { addTreatment } = treatmentSlice.actions;

export default treatmentSlice.reducer;
