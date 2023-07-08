export const SET_DOCTOR_ID = 'SET_DOCTOR_ID';

export const setDoctorId = (doctorId) => {
  return {
    type: SET_DOCTOR_ID,
    payload: doctorId,
  };
};