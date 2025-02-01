// FILE: src/components/InputField.test.tsx

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import InputField from "../InputField";
import { colors } from "../../../colors";

jest.mock("react-native-elements", () => {
  const { TextInput, View, Text } = require("react-native"); // Import View/Text from 'react-native' for basic layout

  return {
    Icon: jest.fn(() => null),
    Input: jest.fn(
      ({ leftIcon, rightIcon, onChangeText, value, placeholder, ...props }) => (
        <View>
          {leftIcon && (
            <View testID={leftIcon.testID}>
              <Text>{leftIcon.name}</Text>{" "}
            </View>
          )}

          {/* Handle rightIcon if present */}
          {rightIcon && (
            <View testID={rightIcon.testID}>
              <Text>{rightIcon.name}</Text> {/* Mock the right icon */}
            </View>
          )}
          <TextInput
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            {...props}
          />
        </View>
      )
    ),
  };
});

describe("InputField Component", () => {
  it("renders correctly with default props", () => {
    const { getByPlaceholderText } = render(
      <InputField value="" onChangeText={() => {}} placeholder="Placeholder" />
    );
    expect(getByPlaceholderText("Placeholder")).toBeTruthy();
  });

  it("displays the label when labelVisible is true", () => {
    const { getByText } = render(
      <InputField
        value=""
        onChangeText={() => {}}
        label="Email"
        labelVisible={true}
      />
    );
    expect(getByText("Email")).toBeTruthy();
  });

  it("calls onChangeText when text is changed", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField value="" onChangeText={onChangeTextMock} />
    );
    fireEvent.changeText(getByPlaceholderText("Placeholder"), "new text");
    expect(onChangeTextMock).toHaveBeenCalledWith("new text");
  });

  it("calls onSubmitEditing when submit is pressed", () => {
    const onSubmitEditingMock = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField
        value=""
        onChangeText={() => {}}
        onSubmitEditing={onSubmitEditingMock}
      />
    );
    fireEvent(getByPlaceholderText("Placeholder"), "submitEditing");
    expect(onSubmitEditingMock).toHaveBeenCalled();
  });

  it("displays the left icon when logo is true", () => {
    const { getByTestId } = render(
      <InputField value="" onChangeText={() => {}} logo={true} />
    );
    expect(getByTestId("input-left-icon")).toBeTruthy();
  });

  it("displays secure text entry when left icon is lock", () => {
    const { getByPlaceholderText } = render(
      <InputField
        value=""
        onChangeText={() => {}}
        leftIcon={{ type: "font-awesome", name: "lock" }}
      />
    );
    expect(getByPlaceholderText("Placeholder").props.secureTextEntry).toBe(
      true
    );
  });

  it("calls onFocus when input is focused", () => {
    const onFocusMock = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField value="" onChangeText={() => {}} onFocus={onFocusMock} />
    );
    fireEvent(getByPlaceholderText("Placeholder"), "focus");
    expect(onFocusMock).toHaveBeenCalled();
  });

  it("calls onBlur when input is blurred", () => {
    const onBlurMock = jest.fn();
    const { getByPlaceholderText } = render(
      <InputField value="" onChangeText={() => {}} onBlur={onBlurMock} />
    );
    fireEvent(getByPlaceholderText("Placeholder"), "blur");
    expect(onBlurMock).toHaveBeenCalled();
  });
});
