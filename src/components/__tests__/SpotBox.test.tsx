// FILE: src/components/SpotBox.test.tsx

import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import SpotBox from "../SpotBox";
import { Alert } from "react-native";
import { supabase } from "../../utils/supabase";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import {
  ParseQuery,
  Ast,
} from "@supabase/postgrest-js/dist/cjs/select-query-parser/parser";
import {
  TypeScriptTypes,
  IsNonEmptyArray,
  AggregateWithColumnFunctions,
} from "@supabase/postgrest-js/dist/cjs/select-query-parser/types";
import { GetFieldNodeResultName } from "@supabase/postgrest-js/dist/cjs/select-query-parser/utils";
// Mock dependencies
jest.mock("../../../assets/icons/bookmarks/place.svg", () => "Place");
jest.mock("../../../assets/icons/bookmarks/trash.svg", () => "Trash");
jest.mock(
  "../../../assets/images/bookmarks/spotDefault.svg",
  () => "SpotDefault"
);

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-toast-message", () => ({
  show: jest.fn((options) => {
    console.log("Toast shown with options:", options);
  }),
}));

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
    spots: [
      {
        spot_id: "1",
        title: "Spot 1",
        created_at: "2023-01-01",
        address: "Address 1",
        coordinates: [0, 0],
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

describe("SpotBox Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByText } = renderWithProviders(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />,
      { store }
    );
    expect(getByText("Spot 1")).toBeTruthy();
    expect(getByText("2023-01-01")).toBeTruthy();
    expect(getByText("Address 1")).toBeTruthy();
  });

  it("calls onPress when 'View Spot' button is pressed", () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });
    const onPressMock = jest.fn();
    const { getByText } = renderWithProviders(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={onPressMock}
      />,
      { store }
    );
    fireEvent.press(getByText("View Spot"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("shows delete confirmation modal when delete button is pressed", () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByText } = renderWithProviders(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />,
      { store }
    );

    fireEvent.press(getByTestId("delete-button"));
    expect(
      getByText("Are you sure you want to delete this note?")
    ).toBeTruthy();
  });

  it("deletes a spot correctly when confirmed", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const deleteSpy = jest.spyOn(supabase, "from").mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      }),
    } as any);

    const { getByTestId, getByText } = renderWithProviders(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByTestId("delete-button"));
    });

    await waitFor(() => {
      expect(
        getByText("Are you sure you want to delete this note?")
      ).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText("Delete"));
    });

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("spots");
    });

    deleteSpy.mockRestore();
  });

  it("Logs an error when deleting a spot fails", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const deleteSpy = jest.spyOn(supabase, "from").mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: "Error deleting spot",
        }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByTestId, getByText } = renderWithProviders(
      <SpotBox
        spot_id="1"
        title="Spot 1"
        date="2023-01-01"
        address="Address 1"
        onPress={jest.fn()}
      />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByTestId("delete-button"));
    });

    await waitFor(() => {
      expect(
        getByText("Are you sure you want to delete this note?")
      ).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText("Delete"));
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting spot: ",
        undefined
      );
    });

    deleteSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
