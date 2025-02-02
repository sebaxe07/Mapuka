import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Settings from "../../screens/Settings";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setUserData } from "../../contexts/slices/userDataSlice";

// Mock dependencies
jest.mock("../../utils/supabase");
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@env");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const initialState = {
  userData: {
    session: null,
    auth: null,
    profile_id: "85c76b",
    email: "",
    name: "",
    lastname: "",
    discovered_area: 0,
    discovered_polygon: null,
    achievements: [],
    created_at: "",
    pic: null,
    notes: [],
    spots: [],
  },
};

const renderWithProviders = (
  ui:
    | string
    | number
    | boolean
    | React.JSX.Element
    | Iterable<React.ReactNode>
    | null
    | undefined,
  {
    preloadedState = initialState,
    store = configureStore({
      reducer: { userData: userDataReducer },
      preloadedState,
    }),
  } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Settings", () => {
  it("resets the map correctly", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const updateSpy = jest.spyOn(supabase, "from").mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any);

    const { getByTestId } = renderWithProviders(<Settings />, {
      store,
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-map"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("profiles");
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        text1: "Map Reset",
        text2: "The discovered area has been reset successfully.",
      });
    });

    const state = store.getState();
    expect(state.userData.discovered_area).toBe(0);

    updateSpy.mockRestore();
  });

  it("shows error when resetting map fails", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const updateSpy = jest.spyOn(supabase, "from").mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Error resetting map" },
        }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByTestId } = renderWithProviders(<Settings />, {
      store,
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-map"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("profiles");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error resetting map:",
        "Error resetting map"
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "Reset Failed",
        text2: "Could not reset map area. Try again later.",
      });
    });

    updateSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
