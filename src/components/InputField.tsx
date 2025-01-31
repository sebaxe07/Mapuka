import React, { forwardRef, useState } from "react";
import { Icon, Input } from "react-native-elements";
import { colors } from "../../colors";
import { View, Text, useColorScheme, TextInput } from "react-native";

interface InputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  label?: string;
  labelVisible?: boolean;
  placeholder?: string;
  placeholderClassname?: string;
  labelClassname?: string;
  className?: string;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "number-pad"
    | "name-phone-pad"
    | "decimal-pad"
    | "twitter"
    | "web-search"
    | "visible-password";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  logo?: boolean;
  leftIcon?: { type: string; name: string };
  disabled?: boolean;
  maxLength?: number;
  rightIconProp?: {
    name: string;
    type: string;
    color: string;
    onPress: () => void;
  };
  rowWidth?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

// InputField is a component that creates a text input field
// Usage:
// <InputField value={email} onChangeText={setEmail} label="Email" labelVisible={true} placeholder="email@email.com" leftIcon={{ type: 'font-awesome', name: 'envelope' }} />
// value: text to be displayed in the input field
// onChangeText: function to be executed when the text in the input field changes
// label: text to be displayed as the label
// labelVisible: boolean to determine if the label is visible
// placeholder: text to be displayed as the placeholder
// keyboardType: type of keyboard to be displayed
// autoCapitalize: type of auto capitalization to be applied
// leftIcon: icon to be displayed on the left of the input field
// disabled: boolean to determine if the input field is disabled
// onSubmitEditing: function to be executed when the user submits the input field

const InputField = forwardRef(
  (
    {
      value,
      onChangeText,
      label = "Placeholder",
      labelVisible = false,
      logo = false,
      placeholder = "Placeholder",
      leftIcon = { type: "font-awesome", name: "envelope" },
      disabled = false,
      autoCapitalize = "none",
      keyboardType = "default",
      maxLength = 100,
      rightIconProp,
      onSubmitEditing,
      rowWidth,
      onBlur,
      onFocus,
      labelClassname,
      placeholderClassname,
      className,
    }: InputFieldProps,
    ref: React.Ref<TextInput>
  ) => {
    const [secureEntry, setSecureEntry] = useState(leftIcon.name === "lock");

    const color = colors;

    return (
      <View className={`${rowWidth}`}>
        {labelVisible ? (
          <Text
            className={`${labelClassname ? labelClassname : "pb-1 pt-3.5 text-lg text-textBody font-senRegular"} `}
          >
            {label}
          </Text>
        ) : null}
        <View
          className={`flex h-12 items-center justify-center rounded-2xl bg-boxMenu`}
        >
          <Input
            ref={ref}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderClassName={`${placeholderClassname ? placeholderClassname : "font-senRegular"}`}
            placeholderTextColor={color.bodyText}
            autoCapitalize={autoCapitalize}
            disabled={disabled}
            leftIcon={
              logo
                ? {
                    ...leftIcon,
                    color: color.bodyText,
                    size: 20,
                    testID: "input-left-icon",
                  }
                : undefined
            }
            leftIconContainerStyle={{
              width: 30,
              height: 30,
            }}
            maxLength={maxLength}
            onSubmitEditing={onSubmitEditing}
            keyboardType={keyboardType}
            inputContainerStyle={{
              borderBottomWidth: 0,
              height: "100%",
            }}
            inputStyle={{
              color: color.bodyText,
              fontFamily: "SenRegular",
            }}
            secureTextEntry={secureEntry}
            className="ml-3 h-full font-senRegular"
            containerStyle={{
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
            onBlur={onBlur}
            onFocus={onFocus}
            rightIcon={
              (leftIcon.name === "lock" && (
                <Icon
                  testID="input-right-icon"
                  name={secureEntry ? "eye-off" : "eye"}
                  type="feather"
                  onPress={() => setSecureEntry(!secureEntry)}
                  color={color.bodyText}
                />
              )) ||
              (rightIconProp && (
                <Icon
                  testID="input-right-icon"
                  name={rightIconProp.name}
                  type={rightIconProp.type}
                  onPress={rightIconProp.onPress}
                  color={rightIconProp.color}
                />
              ))
            }
          />
        </View>
      </View>
    );
  }
);

export default InputField;
