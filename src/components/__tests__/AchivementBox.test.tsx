import React from "react";
import { render } from "@testing-library/react-native";
import AchivementBox from "../AchivementBox";

jest.mock("../../../assets/icons/bookmarks/holder.svg", () => "HolderV");
jest.mock("../../../assets/icons/bookmarks/holderH.svg", () => "HolderH");

describe("AchivementBox", () => {
  it("applies correct styles for vertical layout", () => {
    const { getByText, getByTestId } = render(
      <AchivementBox
        title="Test Title"
        description="Test Description"
        unlocked={true}
        layout="vertical"
      />
    );

    const titleElement = getByText("Test Title");
    const descriptionElement = getByText("Test Description");
    const boxElement = getByTestId("achivement-box");

    expect(titleElement).toBeTruthy();
    expect(descriptionElement).toBeTruthy();
    expect(boxElement.props.style.backgroundColor).toBeTruthy();
    expect(boxElement.props.className).toContain("flex-col");
  });

  it("applies correct styles for horizontal layout", () => {
    const { getByText, getByTestId } = render(
      <AchivementBox
        title="Test Title"
        description="Test Description"
        unlocked={true}
        layout="horizontal"
      />
    );

    const titleElement = getByText("Test Title");
    const descriptionElement = getByText("Test Description");
    const boxElement = getByTestId("achivement-box");

    expect(titleElement).toBeTruthy();
    expect(descriptionElement).toBeTruthy();
    expect(boxElement.props.style.backgroundColor).toBeTruthy();
    expect(boxElement.props.className).toContain("flex-row");
  });
});
