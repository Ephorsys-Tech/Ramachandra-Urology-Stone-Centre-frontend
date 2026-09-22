import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

// =============================================
// Persist Config (Auth state is handled via secure httpOnly cookies and in-memory tokens)
// =============================================

const persistConfig = {
  key: "root",
  storage: storage.default || storage,
  blacklist: [
    "auth",
    "gallery",
    "blog",
    "doctor",
    "department",
    "service",
    "appointmentRequest",
    "message",
    "patient",
    "feature",
    "disease",
  ],
};

// =============================================
// Persist Reducer
// =============================================

const persistedReducer = persistReducer(persistConfig, rootReducer);

// =============================================
// Store
// =============================================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// =============================================
// Persistor
// =============================================

export const persistor = persistStore(store);