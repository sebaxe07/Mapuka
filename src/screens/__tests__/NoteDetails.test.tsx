import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import NoteDetails from "../NoteDetails";
import { supabase } from "../../utils/supabase";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

/* Mock All Icons
import Settings from "../../assets/icons/bookmarks/settings.svg";
import Place from "../../assets/icons/bookmarks/place.svg";
import Edit from "../../assets/icons/profile/edit_clean.svg";
import Trash from "../../assets/icons/bookmarks/trash.svg";
import * as NoteBg from "../../assets/images/bookmarks/index";
*/

jest.mock("../../../assets/icons/bookmarks/settings.svg", () => "Settings");
jest.mock("../../../assets/icons/bookmarks/place.svg", () => "Place");
jest.mock("../../../assets/icons/profile/edit_clean.svg", () => "Edit");
jest.mock("../../../assets/icons/bookmarks/trash.svg", () => "Trash");
jest.mock("../../../assets/images/bookmarks/index", () => ({
  Style1: "Style1",
  Style2: "Style2",
  Style3: "Style3",
  Style4: "Style4",
  Style5: "Style5",
  Style6: "Style6",
}));

// Mock dependencies
jest.mock("../../utils/supabase");
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@env");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
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
    notes: [
      {
        note_id: "1",
        title: "Test Note",
        content: "This is a test note.",
        address: "Test Address",
        image: 1,
        created_at: "2023-01-01T00:00:00Z",
        coordinates: [0, 0],
      },
    ],
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

describe("NoteDetails", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders note details correctly", () => {
    const { getByText } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    expect(getByText("Test Note")).toBeTruthy();
    expect(getByText("This is a test note.")).toBeTruthy();
    expect(getByText("Test Address")).toBeTruthy();
  });

  it("validates inputs length correctly", async () => {
    const { debug, getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByText("Edit"));
    });

    await waitFor(() => {
      fireEvent.changeText(getByTestId("title-edit"), "a".repeat(101));
      fireEvent.changeText(getByTestId("address-edit"), "a".repeat(51));
      fireEvent.changeText(getByTestId("content-edit"), "a".repeat(501));
    });
    await waitFor(() => {
      expect(getByTestId("title-error")).toBeTruthy();
      expect(getByTestId("address-error")).toBeTruthy();
      expect(getByTestId("content-error")).toBeTruthy();
    });
  });

  it("validates inputs empty correctly", async () => {
    const { debug, getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByText("Edit"));
    });

    await waitFor(() => {
      fireEvent.changeText(getByTestId("title-edit"), "");
      fireEvent.changeText(getByTestId("address-edit"), "");
      fireEvent.changeText(getByTestId("content-edit"), "");
    });
    await waitFor(() => {
      expect(getByTestId("title-error")).toBeTruthy();
      expect(getByTestId("address-error")).toBeTruthy();
      expect(getByTestId("content-error")).toBeTruthy();
    });
  });

  it("updates note successfully", async () => {
    const updateSpy = jest.spyOn(supabase, "from").mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any);

    const { getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByText("Edit"));
    });

    fireEvent.changeText(getByTestId("title-edit"), "Updated Title");
    fireEvent.changeText(getByTestId("content-edit"), "Updated Description");
    fireEvent.changeText(getByTestId("address-edit"), "Updated Address");

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await waitFor(() => {
      fireEvent.press(getByText("Yes"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("notes");
      expect(Toast.show).toHaveBeenCalledWith({
        type: "success",
        position: "bottom",
        text1: "Note updated",
        text2: "Your changes have been saved successfully!",
        visibilityTime: 2000,
        autoHide: true,
      });
    });

    const state = store.getState();
    const updatedNote = state.userData.notes.find(
      (note) => note.note_id === "1"
    );
    expect(updatedNote).toBeDefined();
    if (updatedNote) {
      expect(updatedNote.title).toBe("Updated Title");
      expect(updatedNote.content).toBe("Updated Description");
      expect(updatedNote.address).toBe("Updated Address");
    }

    updateSpy.mockRestore();
  });

  it("shows error when updating note fails", async () => {
    const updateSpy = jest.spyOn(supabase, "from").mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Error updating note" },
        }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByText("Edit"));
    });

    fireEvent.changeText(getByTestId("title-edit"), "Updated Title");
    fireEvent.changeText(getByTestId("content-edit"), "Updated Description");
    fireEvent.changeText(getByTestId("address-edit"), "Updated Address");

    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await waitFor(() => {
      fireEvent.press(getByText("Yes"));
    });

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith("notes");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving edited note: ",
        "Error updating note"
      );
    });

    updateSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  /*   it("deletes note successfully", async () => {
    const deleteSpy = jest.spyOn(supabase, "from").mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any);

    const { getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );

    await act(async () => {
      fireEvent.press(getByTestId("delete"));
    });

    await waitFor(() => {
      fireEvent.press(getByText("Delete"));
    });

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("notes");
      expect(Toast.show).toHaveBeenCalledWith({
        autoHide: true,
        position: "bottom",
        visibilityTime: 2000,
        type: "info",
        text1: "Note deleted",
        text2: "Note deleted successfully!",
      });
    });

    const state = store.getState();
    const deletedNote = state.userData.notes.find(
      (note) => note.note_id === "1"
    );
    expect(deletedNote).toBeUndefined();

    deleteSpy.mockRestore();
  }); */

  it("shows error when deleting note fails", async () => {
    const deleteSpy = jest.spyOn(supabase, "from").mockReturnValue({
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Error deleting note" },
        }),
      }),
    } as any);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { debug, getByText, getByTestId } = renderWithProviders(
      <NoteDetails route={{ params: { itemId: "1" } }} />,
      { store }
    );
    debug();
    await act(async () => {
      fireEvent.press(getByTestId("delete"));
    });

    await waitFor(() => {
      fireEvent.press(getByText("Delete"));
    });

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("notes");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error deleting note: ",
        "Error deleting note"
      );
    });

    deleteSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
