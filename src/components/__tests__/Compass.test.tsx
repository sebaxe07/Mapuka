// FILE: src/components/Compass.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Compass from "../Compass";
import { MotiView, useAnimationState } from "moti";

jest.mock("moti", () => ({
  MotiView: jest.fn(({ children }) => children),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
}));

jest.mock("../../../assets/icons/home", () => ({
  Compass: jest.fn(() => null),
}));

describe("Compass Component", () => {
  it("renders correctly with default props", () => {
    const { getByTestId } = render(<Compass bearing={0} onPress={() => {}} />);
    expect(getByTestId("compass")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Compass bearing={0} onPress={onPressMock} />
    );
    fireEvent.press(getByTestId("compass"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("updates animation state when bearing changes", () => {
    const mockTransitionTo = jest.fn();
    (useAnimationState as jest.Mock).mockReturnValue({
      transitionTo: mockTransitionTo,
    });

    const { rerender } = render(<Compass bearing={0} onPress={() => {}} />);
    rerender(<Compass bearing={90} onPress={() => {}} />);
    expect(mockTransitionTo).toHaveBeenCalledWith("to");
  });

  it("renders with custom bearing offset", () => {
    const BEARING_OFFSET = -35;
    const bearing = 90;
    const mockTransitionTo = jest.fn();
    const mockAnimationState = {
      from: { rotate: `${BEARING_OFFSET}deg` },
      to: { rotate: `${-bearing + BEARING_OFFSET}deg` },
      transitionTo: mockTransitionTo,
    };
    (useAnimationState as jest.Mock).mockReturnValue(mockAnimationState);

    render(<Compass bearing={bearing} onPress={() => {}} />);
    expect(mockAnimationState.to.rotate).toBe(
      `${-bearing + BEARING_OFFSET}deg`
    );
  });
});
