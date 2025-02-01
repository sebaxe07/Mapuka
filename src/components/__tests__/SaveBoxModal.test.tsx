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
    const { getByText, getByTestId } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />
    );
    expect(getByText("Make a Note")).toBeTruthy();
    expect(getByTestId("title-input")).toBeTruthy();
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

    const { getByTestId, getByText } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByTestId("title-input"), "Test Note");
    fireEvent.changeText(
      getByTestId("description"),
      "This is a test note description."
    );

    const insertSpy = jest.spyOn(supabase, "from").mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [
            {
              profile_id: "85c76b",
              coordinates: [0, 0],
              address: "Test Address",
              title: "Test Note",
              content: "This is a test note description.",
              image: 1,
            },
          ],
          error: null,
        }),
      }),
    } as any);

    fireEvent.press(getByTestId("save-button"));

    // Simulate the confirmation action in the alert modal
    await waitFor(() => getByText("Save"));
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(insertSpy).toHaveBeenCalledWith("notes");
    });
  });

  it("saves a spot correctly", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByText } = renderWithProviders(
      <SaveBox type="spot" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByTestId("title-input"), "Test Note");

    const insertSpy = jest.spyOn(supabase, "from").mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [
            {
              profile_id: "85c76b",
              coordinates: [0, 0],
              address: "Test Address",
              title: "Test spot",
            },
          ],
          error: null,
        }),
      }),
    } as any);

    fireEvent.press(getByTestId("save-button"));

    // Simulate the confirmation action in the alert modal
    await waitFor(() => getByText("Save"));
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(insertSpy).toHaveBeenCalledWith("spots");
    });
  });

  it("shows error when title is over 100 characters", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByText } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByTestId("title-input"), "a".repeat(101));
    fireEvent.changeText(
      getByTestId("description"),
      "This is a test note description."
    );

    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      expect(getByText("Title must be under 100 characters.")).toBeTruthy();
    });
  });

  it("shows error when description is over 500 characters", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId, getByText } = renderWithProviders(
      <SaveBox type="note" onClose={jest.fn()} coordinates={[0, 0]} />,
      { store }
    );

    fireEvent.changeText(getByTestId("title-input"), "Test Note");
    fireEvent.changeText(getByTestId("description"), "a".repeat(501));

    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      expect(
        getByText("Description must be under 500 characters.")
      ).toBeTruthy();
    });
  });
});
