// FILE: src/components/FloatingNavbar.test.tsx

import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FloatingNavbar from "../FloatingNavbar";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../../contexts/slices/userDataSlice";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock("moti", () => ({
  MotiView: jest.fn(({ children }) => children),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
}));

jest.mock("../../../assets/icons/home", () => ({
  Add: jest.fn(() => null),
  Achivements: jest.fn(() => null),
  Leaderboard: jest.fn(() => null),
  Favorites: jest.fn(() => null),
  Profile: jest.fn(() => null),
  NewNote: jest.fn(() => null),
  NewSpot: jest.fn(() => null),
}));

jest.mock("../../../assets/images/navbarbase.svg", () => "NavbarBase");
jest.mock("../../../assets/icons/home/close_clean.svg", () => "Close");
jest.mock("../utils/Divider", () => "Divider");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
jest.mock("@env");

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

describe("FloatingNavbar Component", () => {
  beforeAll(() => {
    jest.useFakeTimers(); // Mock timers for animations
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after the tests
  });

  it("renders correctly", () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    expect(getByTestId("floating-navbar")).toBeTruthy();
  });

  it("toggles menuExpanded state when middle button is pressed", async () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const middleButton = getByTestId("middle-button");

    // First press: animate the button
    act(() => {
      fireEvent.press(middleButton);
    });

    // Simulate time passage for animation to complete
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("45deg");
    });

    // Second press: reset the button animation
    act(() => {
      fireEvent.press(middleButton);
    });

    act(() => {
      jest.runAllTimers(); // Simulate time passage again for reset animation
    });

    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("0deg");
    });
  });

  it("renders memoizedMiddle with correct rotation when menuExpanded is true", async () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const middleButton = getByTestId("middle-button");

    // First press to toggle state
    act(() => {
      fireEvent.press(middleButton);
    });

    // Ensure the animation completes
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("45deg");
    });
  });

  it("renders memoizedMiddle with correct rotation when menuExpanded is false", async () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const middleButton = getByTestId("middle-button");

    // First press to expand menu
    act(() => {
      fireEvent.press(middleButton);
    });

    act(() => {
      jest.runAllTimers(); // Ensure the first animation is done
    });

    // Second press to collapse menu
    act(() => {
      fireEvent.press(middleButton);
    });

    act(() => {
      jest.runAllTimers(); // Ensure the second animation is done
    });

    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("0deg");
    });
  });

  it("handles the option selected correctly for note", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId } = renderWithProviders(
      <FloatingNavbar coordinates={[0, 0]} />,
      { store }
    );

    const middleButton = getByTestId("middle-button");

    // First press to expand menu
    act(() => {
      fireEvent.press(middleButton);
    });

    act(() => {
      jest.runAllTimers(); // Ensure the first animation is done
    });

    // Press the 'New Note' button
    act(() => {
      fireEvent.press(getByTestId("new-note"));
    });

    act(() => {
      jest.runAllTimers(); // Ensure the second animation is done
    });
    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("0deg");
    });
  });

  it("handles the option selected correctly for spot", async () => {
    const rootReducer = combineReducers({
      userData: userDataReducer,
    });

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
    });

    const { getByTestId } = renderWithProviders(
      <FloatingNavbar coordinates={[0, 0]} />,
      { store }
    );

    const middleButton = getByTestId("middle-button");

    // First press to expand menu
    act(() => {
      fireEvent.press(middleButton);
    });

    act(() => {
      jest.runAllTimers(); // Ensure the first animation is done
    });

    // Press the 'New Note' button
    act(() => {
      fireEvent.press(getByTestId("new-spot"));
    });

    act(() => {
      jest.runAllTimers(); // Ensure the second animation is done
    });
    await waitFor(() => {
      expect(middleButton.props.children[0].props.animate.rotate).toBe("0deg");
    });
  });

  it("navigates to Achievements when the Achievements button is pressed", () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const achievementsButton = getByTestId("achivements-button");

    act(() => {
      fireEvent.press(achievementsButton);
    });

    expect(useNavigation().navigate).toHaveBeenCalledWith("Achivements");
  });

  it("navigates to Leaderboard when the Leaderboard button is pressed", () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const leaderboardButton = getByTestId("leaderboard-button");

    act(() => {
      fireEvent.press(leaderboardButton);
    });

    expect(useNavigation().navigate).toHaveBeenCalledWith("Leaderboard");
  });

  it("navigates to Bookmarks when the Bookmarks button is pressed", () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const bookmarksButton = getByTestId("bookmarks-button");

    act(() => {
      fireEvent.press(bookmarksButton);
    });

    expect(useNavigation().navigate).toHaveBeenCalledWith("Bookmarks");
  });

  it("navigates to Profile when the Profile button is pressed", () => {
    const { getByTestId } = render(<FloatingNavbar coordinates={[0, 0]} />);
    const profileButton = getByTestId("profile-button");

    act(() => {
      fireEvent.press(profileButton);
    });

    expect(useNavigation().navigate).toHaveBeenCalledWith("Profile");
  });
});
