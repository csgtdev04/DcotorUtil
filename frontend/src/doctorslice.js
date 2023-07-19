import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctorId: 0,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setDoctorId: (state, action) => {
      state.doctorId = action.payload;
    },
  },
});

export const { setDoctorId } = doctorSlice.actions;

export default doctorSlice.reducer;
