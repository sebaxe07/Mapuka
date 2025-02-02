import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Login from "../Login";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../contexts/hooks";
import { signInWithEmail, signUpUser } from "../../utils/UserManagement";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { BackHandler } from "react-native";
import { supabase } from "../../utils/supabase";
import { AuthError } from "@supabase/supabase-js";

jest.mock("../../../assets/images/logoMapuka.svg", () => "LogoMapuka");
jest.mock("../../../assets/images/loginBG.svg", () => "BgDesign");
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const mockUserManagement = {
  mockSignError: false,
  mockSignUpError: false,
};

jest.mock("../../utils/UserManagement", () => ({
  signInWithEmail: jest.fn().mockImplementation(({ email, password }) => {
    if (mockUserManagement.mockSignError) {
      // return error
      return new Error("Invalid credentials");
    }
  }),
  signUpUser: jest
    .fn()
    .mockImplementation(({ email, password, name, lastname }) => {
      if (mockUserManagement.mockSignUpError) {
        // return error
        return new Error("Invalid credentials");
      }
      if (!mockUserManagement.mockSignUpError) {
        return undefined;
      }
    }),
}));

jest.mock("@env");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("moti", () => ({
  MotiView: jest.fn(({ children }) => children),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
}));

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock("../../../assets/icons/backArrow.svg", () => "Barrow");
jest.mock("../../components/InputField", () => {
  const { View, TextInput } = require("react-native");
  return function MockedInputField({
    value,
    onChangeText,
    placeholder,
  }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
  }) {
    return (
      <View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </View>
    );
  };
});

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

describe("Login Screen", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders essential UI", () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<Login />, {
      store,
    });

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Log in")).toBeTruthy();
  });

  it("handles login with valid credentials", async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<Login />, {
      store,
    });

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Log in");

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
      fireEvent.changeText(passwordInput, "unittest");
    });
    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith({
        email: "unittest@test.com",
        password: "unittest",
        dispatch: expect.any(Function),
      });
    });
  });
  it("handles login with invalid credentials", async () => {
    mockUserManagement.mockSignError = true;
    const { getByPlaceholderText, getByText, getByTestId } =
      renderWithProviders(<Login />, {
        store,
      });

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Log in");

    await act(async () => {
      fireEvent.changeText(emailInput, "wrongemail@test.com");
      fireEvent.changeText(passwordInput, "wrongpassword");
    });
    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith({
        email: "wrongemail@test.com",
        password: "wrongpassword",
        dispatch: expect.any(Function),
      });
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });

  it("navigates to sign up screen", async () => {
    const { getByTestId } = renderWithProviders(<Login />, {
      store,
    });

    const signUpButton = getByTestId("signup-button");

    await act(async () => {
      fireEvent.press(signUpButton);
    });
  });

  it("navigates to forgot password screen", async () => {
    const { getByTestId } = renderWithProviders(<Login />, {
      store,
    });

    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });
  });

  it("navigates to back", async () => {
    const { debug, getByTestId } = renderWithProviders(<Login />, {
      store,
    });

    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });

    await waitFor(() => {
      expect(getByTestId("back-arrow")).toBeTruthy();
    });
    debug();
    const backButton = getByTestId("back-arrow");
    await act(async () => {
      fireEvent.press(backButton);
    });
  });

  it("triggers the hadrware back button", async () => {
    const { getByTestId } = renderWithProviders(<Login />, {
      store,
    });
    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });

    await act(async () => {
      fireEvent(BackHandler, "hardwareBackPress");
    });
  });

  it("Sends a reset password email", async () => {
    const resetSpy = jest
      .spyOn(supabase.auth, "resetPasswordForEmail")
      .mockReturnValue(
        Promise.resolve({
          data: {},
          error: null,
        })
      );

    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );

    const emailInput = getByPlaceholderText("Email");
    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
    });
    const resetButton = getByTestId("reset-sign");

    await act(async () => {
      fireEvent.press(resetButton);
    });

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalledWith("unittest@test.com");
    });
  });

  it("Shows error when sending reset password email fails", async () => {
    const resetSpy = jest
      .spyOn(supabase.auth, "resetPasswordForEmail")
      .mockReturnValue(
        Promise.resolve({
          data: null,
          error: new AuthError("Error sending reset email"),
        })
      );

    const { getByPlaceholderText, getByTestId, getByText } =
      renderWithProviders(<Login />, {
        store,
      });

    const emailInput = getByPlaceholderText("Email");
    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
    });

    const resetButton = getByTestId("reset-sign");

    await act(async () => {
      fireEvent.press(resetButton);
    });
  });

  it("Shows error when no email is provided for reset password", async () => {
    const { getByPlaceholderText, getByTestId, getByText } =
      renderWithProviders(<Login />, {
        store,
      });

    const emailInput = getByPlaceholderText("Email");
    const forgotPasswordButton = getByTestId("forgot-button");

    await act(async () => {
      fireEvent.press(forgotPasswordButton);
    });

    const resetButton = getByTestId("reset-sign");

    await act(async () => {
      fireEvent.press(resetButton);
    });

    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });

  it("Signs up the user", async () => {
    const { getByPlaceholderText, getByTestId, getByText } =
      renderWithProviders(<Login />, {
        store,
      });

    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");
    const nameInput = getByPlaceholderText("Name");
    const lastnameInput = getByPlaceholderText("Lastname");

    await act(async () => {
      fireEvent.changeText(emailInput, "testsignup@test.com");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.changeText(confirmInput, "testpassword");
      fireEvent.changeText(nameInput, "Test");
      fireEvent.changeText(lastnameInput, "User");
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledWith({
        email: "testsignup@test.com",
        password: "testpassword",
        name: "Test",
        lastname: "User",
        dispatch: expect.any(Function),
      });
    });
  });

  it("Shows error when signing up fails", async () => {
    mockUserManagement.mockSignUpError = true;
    const { getByPlaceholderText, getByTestId, getByText } =
      renderWithProviders(<Login />, {
        store,
      });

    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");
    const nameInput = getByPlaceholderText("Name");
    const lastnameInput = getByPlaceholderText("Lastname");

    await act(async () => {
      fireEvent.changeText(emailInput, "testsignup@test.com");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.changeText(confirmInput, "testpassword");
      fireEvent.changeText(nameInput, "Test");
      fireEvent.changeText(lastnameInput, "User");
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });
  });

  it("Validates email input", async () => {
    mockUserManagement.mockSignUpError = false;

    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );

    const emailInput = getByPlaceholderText("Email");
    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });

    await act(async () => {
      fireEvent.changeText(emailInput, "");
    });
    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });

  it("Validates password equal", async () => {
    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );
    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.changeText(confirmInput, "testpassword2");
    });

    await waitFor(() => {
      fireEvent.press(getByTestId("reset-sign"));
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });

  it("Validates password lenght", async () => {
    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );
    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
      fireEvent.changeText(passwordInput, "a");
      fireEvent.changeText(confirmInput, "a");
    });
    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });

  it("Validates name lenght", async () => {
    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );
    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");
    const nameInput = getByPlaceholderText("Name");

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.changeText(confirmInput, "testpassword");
      fireEvent.changeText(nameInput, "");
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });
  it("Validates lastname lenght", async () => {
    const { getByPlaceholderText, getByTestId } = renderWithProviders(
      <Login />,
      {
        store,
      }
    );
    await act(async () => {
      fireEvent.press(getByTestId("signup-button"));
    });
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmInput = getByPlaceholderText("Confirm Password");
    const nameInput = getByPlaceholderText("Name");
    const lastnameInput = getByPlaceholderText("Lastname");

    await act(async () => {
      fireEvent.changeText(emailInput, "unittest@test.com");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.changeText(confirmInput, "testpassword");
      fireEvent.changeText(nameInput, "Juan");
      fireEvent.changeText(lastnameInput, "");
    });

    await act(async () => {
      fireEvent.press(getByTestId("reset-sign"));
    });
    await waitFor(() => {
      expect(getByTestId("error-message")).toBeTruthy();
    });
  });
});
