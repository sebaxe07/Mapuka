// FILE: src/components/SplashScreen.test.tsx

import React from "react";
import { render } from "@testing-library/react-native";
import SplashScreen from "../SplashScreen";
import { MotiView, useAnimationState } from "moti";

jest.mock("moti", () => ({
  MotiView: jest.fn(({ children }) => children),
  useAnimationState: jest.fn(() => ({
    transitionTo: jest.fn(),
  })),
}));

// Mock the SVG components
jest.mock("../../../assets/images/logoMapuka.svg", () => "Logo");
jest.mock("../../../assets/images/loginBG.svg", () => "BGDecorator");

describe("SplashScreen Component", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<SplashScreen />);
    expect(getByTestId("splash-screen")).toBeTruthy();
  });

  it("renders the Logo component", () => {
    const { getByTestId } = render(<SplashScreen />);
    expect(getByTestId("logo")).toBeTruthy();
  });

  it("renders the BGDecorator component", () => {
    const { getByTestId } = render(<SplashScreen />);
    expect(getByTestId("bg-decorator")).toBeTruthy();
  });
});
