import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../Home";
import * as ImagePicker from "expo-image-picker";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";

jest.mock("../MapFog", () => {
  return function MockedMap() {
    return null;
  };
});
jest.mock("../../components/FloatingNavbar", () => {
  return function MockedFloatingNavbar() {
    return null;
  };
});
jest.mock("../../components/SearchBar", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  const { Input } = require("react-native-elements");
  return function SearchBarMocked(props: any) {
    return (
      <TouchableOpacity testID="search-bar-mocked" onPress={props.onPress}>
        <Text>Mocked SearchBar</Text>
        <Input testID="search-input-mocked" />
      </TouchableOpacity>
    );
  };
});
jest.mock("../../components/Compass", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return function MockedCompass(props: any) {
    return (
      <TouchableOpacity testID="compass" onPress={props.onPress}>
        <Text>Mocked compass</Text>
      </TouchableOpacity>
    );
  };
});
// mock import * as Icons from "../../assets/icons/home";
jest.mock("../../../assets/icons/home", () => ({
  Layers: "Layers",
  Focus: "Focus",
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("moti", () => ({
  MotiView: jest.fn(({ children }) => children),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
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

describe("Home Screen", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders essential UI", () => {
    const { getByTestId } = renderWithProviders(<Home />, {
      store,
    });
    expect(getByTestId("change-theme")).toBeTruthy();
  });

  it("sets external coordinates when route has params", async () => {
    const route = {
      params: {
        externalCoordinates: { latitude: 10, longitude: 20 },
      },
    };
    const spy = jest.spyOn(global.console, "log");
    const { rerender } = renderWithProviders(<Home route={route} />, { store });

    // Checking console logs can be done with a spy:
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("Received External Coordinates:", {
        latitude: 10,
        longitude: 20,
      });
    });
  });

  it("handles search trigger", () => {
    const { getByTestId } = renderWithProviders(<Home />, { store });

    fireEvent.changeText(getByTestId("search-input-mocked"), "Test Place");

    fireEvent.press(getByTestId("search-bar-mocked"));
  });

  it("toggles theme buttons", async () => {
    const { getByTestId } = renderWithProviders(<Home />, { store });

    await waitFor(() => {
      fireEvent.press(getByTestId("change-theme"));
    });

    await waitFor(() => {
      fireEvent.press(getByTestId("change-default"));
      fireEvent.press(getByTestId("change-dark"));
      fireEvent.press(getByTestId("change-light"));
    });

    // Themes appear
    await waitFor(() => {
      fireEvent.press(getByTestId("change-theme"));
    });
    // Themes disappear
  });

  it("handles GPS and compass actions", () => {
    const { getByTestId } = renderWithProviders(<Home />, { store });
    fireEvent.press(getByTestId("gps"));
    fireEvent.press(getByTestId("compass"));
  });
});
