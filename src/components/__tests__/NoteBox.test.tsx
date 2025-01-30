// FILE: src/components/NoteBox.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NoteBox from "../NoteBox";
import * as NoteBg from "../../../assets/images/bookmarks/index";
import Place from "../../../assets/icons/bookmarks/place.svg";

jest.mock("../../../assets/images/bookmarks/index", () => ({
  Style0: jest.fn(() => null),
  Style1: jest.fn(() => null),
  Style2: jest.fn(() => null),
  Style3: jest.fn(() => null),
  Style4: jest.fn(() => null),
  Style5: jest.fn(() => null),
}));

jest.mock("../../../assets/icons/bookmarks/place.svg", () => "Place");

describe("NoteBox Component", () => {
  it("renders correctly with default props", () => {
    const { getByText } = render(
      <NoteBox
        title="Sample Title"
        date="2023-10-01"
        address="123 Sample Street"
        onPress={() => {}}
        styleVariant={0}
      />
    );
    expect(getByText("Sample Title")).toBeTruthy();
    expect(getByText("2023-10-01")).toBeTruthy();
    expect(getByText("123 Sample Street")).toBeTruthy();
    expect(getByText("Open Note")).toBeTruthy();
  });

  it("calls onPress when the button is pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <NoteBox
        title="Sample Title"
        date="2023-10-01"
        address="123 Sample Street"
        onPress={onPressMock}
        styleVariant={0}
      />
    );
    fireEvent.press(getByText("Open Note"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("renders the correct background based on styleVariant", () => {
    const { getByTestId } = render(
      <NoteBox
        title="Sample Title"
        date="2023-10-01"
        address="123 Sample Street"
        onPress={() => {}}
        styleVariant={1}
      />
    );
    expect(NoteBg.Style1).toHaveBeenCalled();
  });

  it("renders the Place icon correctly", () => {
    const { getByTestId } = render(
      <NoteBox
        title="Sample Title"
        date="2023-10-01"
        address="123 Sample Street"
        onPress={() => {}}
        styleVariant={0}
      />
    );
    expect(getByTestId("place-icon")).toBeTruthy();
  });
});
