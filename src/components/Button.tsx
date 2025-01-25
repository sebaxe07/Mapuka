import React, { forwardRef, useState } from "react";
import { Icon, Input } from "react-native-elements";
import { colors } from "../../colors";
import {
  View,
  Text,
  useColorScheme,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  special?: boolean;
  width?: string;
  height?: string;
  disabled?: boolean;
}

// Button is a component that creates a button
// Usage:
// <Button label="Login" onPress={login} special={true} width="w-96" height="h-12" />
// label: text to be displayed on the button
// onPress: function to be executed when the button is pressed
// special: boolean to determine if the button is special
// width: width of the button
// height: height of the button

const Button = React.memo(
  ({
    label,
    onPress,
    special,
    width,
    height,
    disabled = false,
  }: ButtonProps) => {
    const color = colors;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        className={`${special ? "border-textInput border-2" : "bg-buttonAccentRed"} ${width ?? "w-36"} ${height ?? "h-12"} rounded-3xl flex items-center justify-center  pointer-events-auto`}
        style={{ opacity: disabled ? 0.4 : 1 }}
      >
        <Text
          className={`${special ? "text-textInput" : "text-boxMenu"} text-lg font-senSemiBold`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);

export default Button;
