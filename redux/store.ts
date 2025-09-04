// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { contactReducer } from "./reducers/contactReducer";
import { settingsReducer } from "./reducers/settingsReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    contact: contactReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
