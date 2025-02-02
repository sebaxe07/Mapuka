import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import UserData from "../../screens/UserData";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

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
    name: "OldFirstName",
    lastname: "OldLastName",
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

describe("UserData", () => {
  it("shows error when first or last name is empty", async () => {
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

    const { getByTestId } = renderWithProviders(<UserData />, {
      store,
    });

    await act(async () => {
      fireEvent.changeText(getByTestId("firstname"), "");
    });
    await act(async () => {
      fireEvent.changeText(getByTestId("lastname"), "");
    });

    updateSpy.mockRestore();

    await waitFor(() => {
      expect(getByTestId("firstname-error")).toBeTruthy();
      expect(getByTestId("lastname-error")).toBeTruthy();
    });
  });

  it("updates user data successfully", async () => {
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

    const { getByText, getByDisplayValue } = renderWithProviders(<UserData />, {
      store,
    });
    await act(async () => {
      fireEvent.changeText(getByDisplayValue("OldFirstName"), "NewFirstName");
      fireEvent.changeText(getByDisplayValue("OldLastName"), "NewLastName");
    });

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await act(async () => {
      fireEvent.press(getByText("Yes"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("profiles");
      expect(Toast.show).toHaveBeenCalledWith({
        autoHide: true,
        position: "bottom",
        type: "success",
        text1: "Profile Updated",
        text2: "Your name has been updated successfully!",
        visibilityTime: 2000,
      });
    });

    const state = store.getState();
    expect(state.userData.name).toBe("NewFirstName");
    expect(state.userData.lastname).toBe("NewLastName");

    updateSpy.mockRestore();
  });

  it("shows error when updating user data fails", async () => {
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
          error: { message: "Error updating name" },
        }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByText, getByDisplayValue } = renderWithProviders(<UserData />, {
      store,
    });

    fireEvent.changeText(getByDisplayValue("OldFirstName"), "NewFirstName");
    fireEvent.changeText(getByDisplayValue("OldLastName"), "NewLastName");

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await act(async () => {
      fireEvent.press(getByText("Yes"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("profiles");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating name:",
        "Error updating name"
      );
    });

    updateSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
