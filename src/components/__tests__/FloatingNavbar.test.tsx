// FILE: src/components/FloatingNavbar.test.tsx

import React, { act } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FloatingNavbar from "../FloatingNavbar";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
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

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

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
});
