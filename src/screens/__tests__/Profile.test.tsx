import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Profile from "../Profile";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../contexts/hooks";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import ErrorBoundary from "../../components/ErrorBoundary"; // Import the ErrorBoundary

jest.mock("expo-image-picker", () => ({
  ...jest.requireActual("expo-image-picker"), // Preserve any real exports
  launchImageLibraryAsync: jest.fn().mockImplementation(async () => {
    console.log("Mock ImagePicker called!"); // Debugging log
    return {
      canceled: false,
      assets: [
        { uri: "https://example.com/avatar.png", mimeType: "image/jpeg" },
      ],
    };
  }),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));

const mockSupabase = {
  listError: false,
  updateError: false,
  removeError: false,
  dbUpdateError: false,
  getError: false,
  getError2: false,
};

jest.mock("../../utils/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        remove: jest.fn(async () => {
          console.log("Mocked remove called");
          return mockSupabase.removeError
            ? { error: new Error("Mocked remove error") }
            : { error: null };
        }),
        update: jest.fn(async () => {
          console.log("Mocked update called");
          return mockSupabase.updateError
            ? { error: new Error("Mocked update error") }
            : { data: { path: "mocked/path" }, error: null };
        }),
        getPublicUrl: jest.fn(() => {
          console.log("Mocked getPublicUrl called");
          return mockSupabase.getError
            ? null
            : mockSupabase.getError2
              ? { error: new Error("Mocked get error") }
              : {
                  data: { publicUrl: "https://mocked.url/avatar.png" },
                  error: null,
                };
        }),
        list: jest.fn(async () => {
          console.log("Mocked list called");
          return mockSupabase.listError
            ? { error: new Error("Mocked list error") }
            : {
                data: [{ name: "image1.jpg" }, { name: "image2.jpg" }],
                error: null,
              };
        }),
      })),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(async () => {
          console.log("Mocked update.eq called");
          return mockSupabase.dbUpdateError
            ? { error: new Error("Mocked DB update error") }
            : { error: null };
        }),
      })),
    })),
    auth: {
      signOut: jest.fn(),
    },
  },
}));

jest.mock(
  "../../../assets/icons/profile/profile_default.svg",
  () => "ProfileDefault"
);
jest.mock("../../../assets/icons/edit_icon.svg", () => "Edit");

jest.mock("../../components/backArrow", () => {
  return function MockedBack() {
    return null;
  };
});
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock import * as Icons from "../../assets/icons/profile/index";
jest.mock("../../../assets/icons/profile/index", () => ({
  BackArrow: "BackArrow",
  Achivements: "Achivements",
  UserIcon: "UserIcon",
  Calendar: "Calendar",
  Track: "Track",
  User: "User",
  Lock: "Lock",
  Settings: "Settings",
  LogOut: "LogOut",
}));

jest.mock("../../utils/UserManagement", () => ({
  signOut: jest.fn(),
}));

jest.mock("@env");

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));
const initialState = {
  userData: {
    session: null,
    auth: null,
    profile_id: "85c76b",
    email: "test@example.com",
    name: "Test User",
    lastname: "",
    discovered_area: 123.45,
    discovered_polygon: null,
    achievements: [
      { id: 1, unlocked: true },
      { id: 2, unlocked: false },
      { id: 3, unlocked: true },
      { id: 4, unlocked: false },
      { id: 5, unlocked: true },
      { id: 6, unlocked: false },
      { id: 7, unlocked: true },
      { id: 8, unlocked: false },
      { id: 9, unlocked: true },
    ],
    created_at: "2025-01-24 23:03:34.304183+00",
    pic: {
      pictureUrl: "https://example.com/avatar.png",
      arrayBuffer: "",
      path: "",
      image: {} as ImagePicker.ImagePickerAsset,
    },
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
  return render(
    <Provider store={store}>
      <ErrorBoundary>{ui}</ErrorBoundary>
    </Provider>
  );
};

const mockNavigation = { navigate: jest.fn(), setOptions: jest.fn() };
describe("Profile Screen", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders essential UI", async () => {
    const { getByText, getByLabelText } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      expect(getByText("Hello, Test User!")).toBeTruthy();
      expect(getByText("test@example.com")).toBeTruthy();
      expect(getByText("123.45 km")).toBeTruthy();
      expect(getByText("55.55%")).toBeTruthy();
      expect(getByLabelText("Avatar")).toBeTruthy();
    });
  });

  it("handles logging out", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    const { getByTestId, getByText } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("logout"));
    });

    await waitFor(() => {
      fireEvent.press(getByText("Yes, Log out"));
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("User logged out");
    });
  });

  it("handles avatar upload", async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const consoleSpy = jest.spyOn(console, "log");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Uploading avatar");
    });

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });
    consoleSpy.mockRestore();
  });

  it("handles list avatar error", async () => {
    mockSupabase.listError = true;

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const consoleSpy = jest.spyOn(console, "error");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching existing images:",
        new Error("Mocked list error")
      );
    });
    consoleSpy.mockRestore();
  });

  it("handles delete avatar error", async () => {
    mockSupabase.listError = false;
    mockSupabase.removeError = true;

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const consoleSpy = jest.spyOn(console, "error");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting existing image:",
        new Error("Mocked remove error")
      );
    });
    consoleSpy.mockRestore();
  });

  it("handles upload avatar error", async () => {
    mockSupabase.removeError = false;
    mockSupabase.updateError = true;

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const consoleSpy = jest.spyOn(console, "error");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error uploading image:",
        new Error("Mocked update error")
      );
    });
    consoleSpy.mockRestore();
  });

  it("handles get public URL error 1", async () => {
    mockSupabase.updateError = false;
    mockSupabase.getError = true;

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const consoleSpy = jest.spyOn(console, "error");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "No reply for: ",
        expect.stringContaining("85c76b/")
      );
    });
    consoleSpy.mockRestore();
  });

  it("handles get public URL error 2", async () => {
    mockSupabase.getError = false;
    mockSupabase.getError2 = true;

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const consoleSpy = jest.spyOn(console, "error");

    const { getByTestId } = renderWithProviders(<Profile />, {
      store,
    });
    await waitFor(() => {
      fireEvent.press(getByTestId("upload-avatar"));
    });
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("avatars");
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching signed URL for photo:",
        expect.stringContaining("85c76b/")
      );
    });
    consoleSpy.mockRestore();
  });

  it("calculates days explored correctly", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const { debug, getByText } = renderWithProviders(<Profile />, {
      store,
    });

    debug();

    const createdDate = new Date(initialState.userData.created_at);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - createdDate.getTime());
    const daysSinceCreation = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // Check that is not nan
    let testDays = daysSinceCreation;
    if (!isNaN(daysSinceCreation)) {
      testDays = daysSinceCreation;
    } else {
      testDays = 0;
    }

    await waitFor(() => {
      expect(getByText(`${testDays} days`)).toBeTruthy();
    });
  });
});
