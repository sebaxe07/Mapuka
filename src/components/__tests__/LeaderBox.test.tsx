// FILE: src/components/LeaderBox.test.tsx

import React from "react";
import { render } from "@testing-library/react-native";
import LeaderBox from "../LeaderBox";
import { colors } from "../../../colors";
import ProfilePic from "../ProfilePic";

jest.mock("../../../assets/icons/bookmarks/holder.svg", () => "HolderV");
jest.mock("../../../assets/icons/bookmarks/holderH.svg", () => "HolderH");
jest.mock("../../../assets/icons/leaderboard/index", () => ({
  Trophy: jest.fn(() => null),
}));
jest.mock("../ProfilePic", () => jest.fn(() => null));

describe("LeaderBox Component", () => {
  it("renders correctly with default props", () => {
    const { getByText } = render(<LeaderBox user="John Doe" distance="10" />);
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("10 km")).toBeTruthy();
  });

  it("renders with custom image and top rank", () => {
    const { getByText } = render(
      <LeaderBox
        user="Jane Doe"
        distance="20"
        image="https://example.com/image.jpg"
        top="1"
      />
    );
    expect(getByText("Jane Doe")).toBeTruthy();
    expect(getByText("20 km")).toBeTruthy();
    expect(ProfilePic).toHaveBeenCalledWith(
      expect.objectContaining({
        avatarUrl: "https://example.com/image.jpg",
        size: 90,
        crown: true,
      }),
      {}
    );
  });

  it("applies correct styles for top 1", () => {
    const { getByText } = render(
      <LeaderBox user="Jane Doe" distance="20" top="1" />
    );
    const userText = getByText("Jane Doe");
    const distanceText = getByText("20 km");
    expect(userText.props.className).toContain("text-4xl");
    expect(distanceText.props.className).toContain(
      "text-2xl text-buttonDarkRed"
    );
  });

  it("applies correct styles for top 2", () => {
    const { getByText } = render(
      <LeaderBox user="Jane Doe" distance="20" top="2" />
    );
    const userText = getByText("Jane Doe");
    const distanceText = getByText("20 km");
    expect(userText.props.className).toContain("text-2xl");
    expect(distanceText.props.className).toContain("text-xl text-buttonOrange");
  });

  it("applies correct styles for top 3", () => {
    const { getByText } = render(
      <LeaderBox user="Jane Doe" distance="20" top="3" />
    );
    const userText = getByText("Jane Doe");
    const distanceText = getByText("20 km");
    expect(userText.props.className).toContain("text-2xl");
    expect(distanceText.props.className).toContain(
      "text-xl text-buttonDarkRed"
    );
  });

  it("applies correct styles for other ranks", () => {
    const { getByText } = render(
      <LeaderBox user="Jane Doe" distance="20" top="4" />
    );
    const userText = getByText("Jane Doe");
    const distanceText = getByText("20 km");
    expect(userText.props.className).toContain("text-lg");
    expect(distanceText.props.className).toContain("text-textBody text-lg");
  });

  it("renders with horizontal layout", () => {
    const { getByTestId } = render(
      <LeaderBox user="Jane Doe" distance="20" layout="horizontal" />
    );
    const container = getByTestId("leader-box");
    expect(container.props.className).toContain("flex-row gap-2 px-5 py-5");
  });

  it("renders with vertical layout", () => {
    const { getByTestId } = render(
      <LeaderBox user="Jane Doe" distance="20" layout="vertical" />
    );
    const container = getByTestId("leader-box");
    expect(container.props.className).toContain("flex-col gap-1 px-5 py-2");
  });
});
