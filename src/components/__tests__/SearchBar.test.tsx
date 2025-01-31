// FILE: src/components/SearchBar.test.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../SearchBar";
import { Search } from "../../../assets/icons/home";

// Mock the Search icon
jest.mock("../../../assets/icons/home", () => ({
  Search: jest.fn(() => null),
}));

describe("SearchBar Component", () => {
  it("renders correctly with default props", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} onPress={jest.fn()} />
    );
    expect(getByPlaceholderText("Search")).toBeTruthy();
  });

  it("updates value when text is entered", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeTextMock} onPress={jest.fn()} />
    );
    const input = getByPlaceholderText("Search");
    fireEvent.changeText(input, "test");
    expect(onChangeTextMock).toHaveBeenCalledWith("test");
  });

  it("calls onPress when search is submitted", () => {
    const onPressMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} onPress={onPressMock} />
    );
    const input = getByPlaceholderText("Search");
    fireEvent(input, "onSubmitEditing");
    expect(onPressMock).toHaveBeenCalled();
  });
});
