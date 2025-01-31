// FILE: src/components/SaveBoxModal.test.tsx

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SaveBox from "../SaveBoxModal";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabase";
import userDataReducer from "../../contexts/slices/userDataSlice";

// Mock dependencies
jest.mock("../../../assets/icons/home/close_clean.svg", () => "Close");
jest.mock("../utils/Divider", () => "Divider");
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

describe("SaveBox Component", () => {
  it("renders correctly with default props", () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />
    );
    expect(getByText("Make a Note")).toBeTruthy();
    expect(getByPlaceholderText("Title")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = renderWithProviders(
      <SaveBox type="note" onClose={onCloseMock} coordinates={[0, 0]} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("saves a note correctly", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByPlaceholderText } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByPlaceholderText("Title"), "Test Note");
    fireEvent.changeText(
      getByPlaceholderText("Description"),
      "This is a test note description."
    );

    fireEvent.press(getByTestId("save-button"));

    // Wait for the note to be inserted
    await waitFor(async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("title", "Test Note");

      expect(error).toBeNull();
      expect(data).toHaveLength(1);

      expect(data).not.toBeNull();
      expect(data![0].title).toBe("Test Note");
      expect(data![0].content).toBe("This is a test note description.");
      expect(data![0].coordinates).toEqual([0, 0]);
    });

    // Cleanup: Delete the test note
    await supabase.from("notes").delete().eq("title", "Test Note");
  });

  it("saves a spot correctly", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByPlaceholderText } = renderWithProviders(
      <SaveBox type="spot" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByPlaceholderText("Title"), "Test Spot");

    fireEvent.press(getByTestId("save-button"));

    // Wait for the note to be inserted
    await waitFor(async () => {
      const { data, error } = await supabase
        .from("spots")
        .select("*")
        .eq("title", "Test Spot");

      expect(error).toBeNull();
      expect(data).toHaveLength(1);

      expect(data).not.toBeNull();
      expect(data![0].title).toBe("Test Spot");
      expect(data![0].coordinates).toEqual([0, 0]);
    });

    // Cleanup: Delete the test note
    await supabase.from("spots").delete().eq("title", "Test Spot");
  });
});
