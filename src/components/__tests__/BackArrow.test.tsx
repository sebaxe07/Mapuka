// FILE: src/components/BackArrow.test.tsx

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import BackArrow from "../backArrow";
import { useNavigation } from "@react-navigation/native";

// Mock the useNavigation hook
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock("../../../assets/icons/backArrow.svg", () => "Barrow");

describe("BackArrow Component", () => {
  it("renders correctly with default props", () => {
    const { getByTestId } = render(<BackArrow />);
    expect(getByTestId("back-arrow")).toBeTruthy();
  });

  it("calls defaultPress when pressed and onpress is not provided", () => {
    const { getByTestId } = render(<BackArrow />);
    act(() => {
      fireEvent.press(getByTestId("back-arrow"));
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("calls onpress when provided and pressed", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<BackArrow onpress={onPressMock} />);
    act(() => {
      fireEvent.press(getByTestId("back-arrow"));
    });
    expect(onPressMock).toHaveBeenCalled();
  });

  it("renders with custom size and padding", () => {
    const { getByTestId } = render(<BackArrow size={30} padding={10} />);
    const arrow = getByTestId("back-arrow");
    expect(arrow.props.style[1].paddingHorizontal).toBe(10);
    expect(arrow.props.children[0].props.width).toBe(30);
    expect(arrow.props.children[0].props.height).toBe(30);
  });
});
