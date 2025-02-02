import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";
import BookmarksScreen from "../Bookmarks";
import { useNavigation } from "@react-navigation/native";
import Profile from "../Profile";
import { useAppDispatch, useAppSelector } from "../../contexts/hooks";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { MotiView } from "moti";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
    navigate: jest.fn(),
  }),
}));
jest.mock("@env");

jest.mock("../../components/NoteBox", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return function MockedNoteBox({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
});

jest.mock("../../components/SpotBox", () => {
  const { View, Text, TouchableOpacity } = require("react-native");
  return function MockedSpotBox({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View>
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
});

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("moti", () => ({
  MotiView: jest.fn(({ children, testID, ...props }) => {
    const { View } = require("react-native");
    return (
      <View testID={testID} {...props}>
        {children}
      </View>
    );
  }),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
}));
jest.mock("moti/interactions", () => ({
  MotiPressable: jest.fn(({ children, testID }) => {
    const { View } = require("react-native");
    return <View testID={testID}>{children}</View>;
  }),
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
    notes: [
      {
        note_id: "1",
        created_at: "2022-01-01T00:00:00Z",
        coordinates: [10, 20],
        address: "Address 1",
        title: "Note 1",
        content: "Content 1",
        image: 2,
      },
      {
        note_id: "2",
        created_at: "2022-01-02T00:00:00Z",
        coordinates: [30, 40],
        address: "Address 2",
        title: "Note 2",
        content: "Content 2",
        image: 3,
      },
    ],
    spots: [
      {
        spot_id: "1",
        created_at: "2022-01-01T00:00:00Z",
        coordinates: [30, 40],
        address: "Address 1",
        title: "Spot 1",
      },
      {
        spot_id: "2",
        created_at: "2022-01-02T00:00:00Z",
        coordinates: [],
        address: "Address 2",
        title: "Spot 2",
      },
    ],
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

describe("BookmarksScreen", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders essential UI", async () => {
    const { getByText } = renderWithProviders(<BookmarksScreen />, {
      store,
    });

    await waitFor(() => {
      expect(getByText("Your")).toBeTruthy();
      expect(getByText("Bookmarks")).toBeTruthy();
      expect(getByText("Notes")).toBeTruthy();
      expect(getByText("Spots")).toBeTruthy();
    });
  });

  it("displays loading indicator initially", () => {
    const { getByTestId } = renderWithProviders(<BookmarksScreen />, {
      store,
    });
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("switches tabs correctly", async () => {
    const { getByTestId, getByText } = renderWithProviders(
      <BookmarksScreen />,
      {
        store,
      }
    );
    // set a timeout to simulate the loading of the data

    await act(async () => {
      fireEvent.press(getByTestId("spots-tab"));
    });
    await act(async () => {
      fireEvent.press(getByTestId("notes-tab"));
    });
  });

  it("navigates to note details", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <BookmarksScreen />,
      {
        store,
      }
    );

    await waitFor(() => {
      fireEvent.press(getByText("Note 1"));
    });
  });

  it("navigates to spot details", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <BookmarksScreen />,
      {
        store,
      }
    );

    await waitFor(() => {
      fireEvent.press(getByText("Spot 1"));
    });
  });

  it("error when no coordinates", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <BookmarksScreen />,
      {
        store,
      }
    );

    await waitFor(() => {
      fireEvent.press(getByText("Spot 2"));
    });
  });

  it("handles swipe gestures to switch tabs", async () => {
    const { getByTestId } = renderWithProviders(<BookmarksScreen />, {
      store,
    });

    await waitFor(() => {
      expect(getByTestId("notes-panel")).toBeTruthy();
      expect(getByTestId("spots-panel")).toBeTruthy();
    });

    const notesPanel = getByTestId("notes-panel");
    const spotsPanel = getByTestId("spots-panel");

    // Simulate a swipe left (start from right to left)
    // Swipe left to switch to spots tab
    fireEvent(notesPanel, "onMoveShouldSetPanResponder", {
      nativeEvent: {},
      gestureState: { dx: 50 },
    });

    fireEvent(notesPanel, "onResponderRelease", {
      nativeEvent: {},
      gestureState: { dx: 21 }, // Positive dx means right swipe
    });
  });
});
