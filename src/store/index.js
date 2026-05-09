import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import raveReducer from "./raveSlice";
import recordingsReducer from "./recordingsSlice";
import serverReducer from "./serverSlice";

// Keep the app state split by feature so each screen reads only what it needs.
const rootReducer = combineReducers({
  server: serverReducer,
  recordings: recordingsReducer,
  rave: raveReducer,
});

// Persist only the slices required by the project consignes.
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: ["server", "recordings", "rave"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable metadata actions internally.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
