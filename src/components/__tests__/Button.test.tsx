// FILE: src/components/Button.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Button from "../Button";
import { TouchableOpacity } from "react-native";

describe("Button Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Button label="Test Button" />);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("displays the correct label", () => {
    const { getByText } = render(<Button label="Login" />);
    expect(getByText("Login")).toBeTruthy();
  });

  it("calls the onPress function when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="Press Me" onPress={onPressMock} />
    );
    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("applies the correct styles when special is true", () => {
    const { getByText } = render(
      <Button label="Special Button" special={true} />
    );

    // Find the Text element
    let element = getByText("Special Button");

    // Traverse up until we find a TouchableOpacity
    while (element && element.type !== TouchableOpacity) {
      element = element.parent;
    }

    expect(element.props.className).toContain("border-textInput border-2");
  });

  it("applies the correct styles when disabled is true", () => {
    const { getByText } = render(
      <Button label="Disabled Button" disabled={true} />
    );
    const button = getByText("Disabled Button").parent.parent;
    expect(button.props.style.opacity).toBe(0.4);
  });
});
