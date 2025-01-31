// FILE: src/components/SpotBox.test.tsx

import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import SpotBox from "../SpotBox";
import { Alert } from "react-native";
import { supabase } from "../../utils/supabase";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
// Mock dependencies
jest.mock("../../contexts/hooks");
jest.mock("../../../assets/icons/bookmarks/place.svg", () => "Place");
jest.mock("../../../assets/icons/bookmarks/trash.svg", () => "Trash");
jest.mock(
  "../../../assets/images/bookmarks/spotDefault.svg",
  () => "SpotDefault"
);

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

describe("SpotBox Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />
    );
    expect(getByText("Spot 1")).toBeTruthy();
    expect(getByText("2023-01-01")).toBeTruthy();
    expect(getByText("Address 1")).toBeTruthy();
  });

  it("calls onPress when 'View Spot' button is pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={onPressMock}
      />
    );
    fireEvent.press(getByText("View Spot"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("calls handleDelete when delete button is pressed", () => {
    jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
    });

    const { getByTestId } = render(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />
    );

    fireEvent.press(getByTestId("delete-button"));
    waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Delete Spot",
        "Are you sure you want to delete this Spot?",
        expect.any(Array)
      );
    });
  });
});
