// FILE: src/components/ProfilePic.test.tsx

import React from "react";
import { render } from "@testing-library/react-native";
import ProfilePic from "../ProfilePic";

// Mock the SVG components
jest.mock(
  "../../../assets/icons/profile/profile_default.svg",
  () => "ProfileDefault"
);
jest.mock("../../../assets/icons/leaderboard/crown.svg", () => "Crown");

describe("ProfilePic Component", () => {
  it("renders correctly with default props", () => {
    const { getByLabelText } = render(
      <ProfilePic avatarUrl="https://picsum.photos/200" />
    );
    expect(getByLabelText("Avatar")).toBeTruthy();
  });

  it("renders with custom size and border", () => {
    const { getByLabelText } = render(
      <ProfilePic
        avatarUrl="https://picsum.photos/200"
        size={100}
        border="border-2"
      />
    );
    const avatar = getByLabelText("Avatar");
    expect(avatar.props.style[0].height).toBe(100);
    expect(avatar.props.style[0].width).toBe(100);
  });

  it("renders with crown when crown prop is true", () => {
    const { getByTestId } = render(
      <ProfilePic avatarUrl="https://picsum.photos/200" crown={true} />
    );
    expect(getByTestId("crown")).toBeTruthy();
  });

  it("renders with avatar image when avatarUrl is provided", () => {
    const { getByLabelText } = render(
      <ProfilePic avatarUrl="https://example.com/avatar.jpg" />
    );
    const avatar = getByLabelText("Avatar");
    expect(avatar.props.source.uri).toBe("https://example.com/avatar.jpg");
  });

  it("renders with default profile image when avatarUrl is not provided", () => {
    const { getByLabelText } = render(<ProfilePic avatarUrl="" />);
    expect(getByLabelText("profile-default")).toBeTruthy();
  });
});
