import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userDataReducer from "../slices/userDataSlice";
import { store, persistor } from "../store";
import { combineReducers } from "@reduxjs/toolkit";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe("Redux Store", () => {
  it("should configure the store with the persisted reducer", () => {
    const persistConfig = {
      key: "root",
      storage: AsyncStorage,
    };

    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const testStore = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          inmutableCheck: false,
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
      devTools: true,
    });

    const expectedState = {
      userData: {
        achievements: [],
        auth: null,
        created_at: "",
        discovered_area: 0,
        discovered_polygon: null,
        email: "",
        lastname: "",
        name: "",
        notes: [],
        pic: null,
        profile_id: "",
        session: null,
        spots: [],
      },
    };
    expect(testStore.getState()).toEqual(expectedState);
  });

  it("should configure the persistor with the store", () => {
    const testPersistor = persistStore(store);
    expect(testPersistor).toBeDefined();
  });
});
