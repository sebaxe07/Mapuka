import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../Home";

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

describe("Home Screen", () => {
  it("renders essential UI", () => {
    const { getByTestId } = render(<Home />);
    expect(getByTestId("change-theme")).toBeTruthy();
  });

  it("sets external coordinates when route has params", async () => {
    const route = {
      params: {
        externalCoordinates: { latitude: 10, longitude: 20 },
      },
    };
    const spy = jest.spyOn(global.console, "log");
    const { rerender } = render(<Home route={route} />);
    rerender(<Home route={route} />);
    // Checking console logs can be done with a spy:
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("Received External Coordinates:", {
        latitude: 10,
        longitude: 20,
      });
    });
  });

  it("handles search trigger", () => {
    const { debug, getByTestId } = render(<Home />);
    debug();
    fireEvent.changeText(getByTestId("search-input-mocked"), "Test Place");
    debug();
    fireEvent.press(getByTestId("search-bar-mocked"));
  });

  it("toggles theme buttons", async () => {
    const { getByTestId } = render(<Home />);

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
    const { getByTestId } = render(<Home />);
    fireEvent.press(getByTestId("gps"));
    fireEvent.press(getByTestId("compass"));
  });
});
