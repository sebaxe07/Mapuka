// FILE: src/components/AlertModal.test.tsx

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import AlertModal from "../AlertModal";
import { SvgProps } from "react-native-svg";

jest.mock("react-native-modal", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe("AlertModal Component", () => {
  it("renders correctly when visible", () => {
    const { getByText } = render(
      <AlertModal
        isVisible={true}
        onBackdropPress={() => {}}
        message="Test Message"
        onCancel={() => {}}
        cancelText="Cancel"
      />
    );
    expect(getByText("Test Message")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const onCancelMock = jest.fn();
    const { getByText } = render(
      <AlertModal
        isVisible={true}
        onBackdropPress={() => {}}
        message="Test Message"
        onCancel={onCancelMock}
        cancelText="Cancel"
      />
    );
    act(() => {
      fireEvent.press(getByText("Cancel"));
    });
    expect(onCancelMock).toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <AlertModal
        isVisible={true}
        onBackdropPress={() => {}}
        message="Test Message"
        onCancel={() => {}}
        onConfirm={onConfirmMock}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    );
    act(() => {
      fireEvent.press(getByText("Confirm"));
    });
    expect(onConfirmMock).toHaveBeenCalled();
  });

  it("displays loading indicator when loading is true", () => {
    const { getByTestId } = render(
      <AlertModal
        isVisible={true}
        onBackdropPress={() => {}}
        message="Test Message"
        onCancel={() => {}}
        cancelText="Cancel"
        loading={true}
      />
    );
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });

  it("does not call onConfirm when confirm button is pressed and loading is true", () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <AlertModal
        isVisible={true}
        onBackdropPress={() => {}}
        message="Test Message"
        onCancel={() => {}}
        onConfirm={onConfirmMock}
        confirmText="Confirm"
        cancelText="Cancel"
        loading={true}
      />
    );
    act(() => {
      fireEvent.press(getByText("Confirm"));
    });
    expect(onConfirmMock).not.toHaveBeenCalled();
  });
});
