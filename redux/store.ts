// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { contactReducer } from "./reducers/contactReducer";
import { settingsReducer } from "./reducers/settingsReducer";
import { blogReducer } from "./reducers/blogReducer";
import { blogCategoryReducer } from "./reducers/blogCategoryReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    contact: contactReducer,
    settings: settingsReducer,
    blog: blogReducer,
    blogCategory: blogCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
