import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ResetPassword from "../../screens/ResetPassword";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AuthError } from "@supabase/supabase-js";

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
    email: "test@example.com",
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

describe("ResetPassword", () => {
  it("sends reset password email successfully", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const resetPasswordSpy = jest
      .spyOn(supabase.auth, "resetPasswordForEmail")
      .mockResolvedValue({
        data: {},
        error: null,
      });

    const { getByTestId } = renderWithProviders(<ResetPassword />, {
      store,
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-password"));
    });

    await waitFor(() => {
      expect(resetPasswordSpy).toHaveBeenCalledWith("test@example.com");
      expect(Toast.show).toHaveBeenCalledWith({
        position: "bottom",
        visibilityTime: 3000,
        type: "success",
        text1: "Reset Link Sent",
        text2: "Check your email (test@example.com) for reset instructions.",
      });
    });

    resetPasswordSpy.mockRestore();
  });

  it("shows error when sending reset password email fails", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const resetPasswordSpy = jest
      .spyOn(supabase.auth, "resetPasswordForEmail")
      .mockResolvedValue({
        data: null,
        error: new AuthError("Error sending reset email"),
      });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByTestId } = renderWithProviders(<ResetPassword />, {
      store,
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-password"));
    });

    await waitFor(() => {
      expect(resetPasswordSpy).toHaveBeenCalledWith("test@example.com");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error sending reset email:",
        "Error sending reset email"
      );
      expect(Toast.show).toHaveBeenCalledWith({
        position: "bottom",
        visibilityTime: 3000,
        type: "error",
        text1: "Reset Failed",
        text2: "Failed to send reset link. Try again later.",
      });
    });

    resetPasswordSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
