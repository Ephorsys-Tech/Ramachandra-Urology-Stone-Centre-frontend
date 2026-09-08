import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import patientReducer from "./features/patient/patientSlice";
import doctorReducer from "./features/doctor/doctorSlice";
import departmentReducer from "./features/department/departmentSlice";
import appointmentRequestReducer from "./features/appointmentRequest/appointmentRequestSlice";
import galleryReducer from "./features/gallery/gallerySlice";
import messageReducer from "./features/message/messageSlice";
import blogReducer from "./features/blog/blogSlice";
import settingReducer from "./features/setting/settingSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  patient: patientReducer,
  doctor: doctorReducer,
  department: departmentReducer,
  appointmentRequest: appointmentRequestReducer,
  gallery: galleryReducer,
  message: messageReducer,
  blog: blogReducer,
  setting: settingReducer,
});

export default rootReducer;
