import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Leaderboard from "../Leaderboard";
import { supabase } from "../../utils/supabase";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("../../utils/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnThis(),
      list: jest.fn().mockReturnThis(),
      getPublicUrl: jest.fn().mockReturnThis(),
    },
  },
}));

jest.mock(
  "../../../assets/icons/profile/profile_default.svg",
  () => "ProfileDefault"
);
jest.mock("../../../assets/icons/leaderboard/crown.svg", () => "Crown");

describe("Leaderboard", () => {
  it("renders correctly and fetches leaderboard data", async () => {
    const mockProfiles = [
      { profile_id: "1", name: "User1", discovered_area: 100 },
      { profile_id: "2", name: "User2", discovered_area: 90 },
      { profile_id: "3", name: "User3", discovered_area: 80 },
      { profile_id: "4", name: "User4", discovered_area: 70 },
      { profile_id: "5", name: "User5", discovered_area: 60 },
      { profile_id: "6", name: "User6", discovered_area: 50 },
    ];

    const mockImages = [
      { name: "image1.png" },
      { name: "image2.png" },
      { name: "image3.png" },
      { name: "image4.png" },
      { name: "image5.png" },
      { name: "image6.png" },
    ];

    const mockPublicUrls = [
      { publicUrl: "https://example.com/image1.png" },
      { publicUrl: "https://example.com/image2.png" },
      { publicUrl: "https://example.com/image3.png" },
      { publicUrl: "https://example.com/image4.png" },
      { publicUrl: "https://example.com/image5.png" },
      { publicUrl: "https://example.com/image6.png" },
    ];

    (
      supabase
        .from("profiles")
        .select()
        .order("discovered_area", { ascending: false }).limit as jest.Mock
    ).mockResolvedValue({ data: mockProfiles, error: null });
    (supabase.storage.from("profiles").list as jest.Mock).mockResolvedValue({
      data: mockImages,
      error: null,
    });
    supabase.storage.from("profiles").getPublicUrl = jest.fn((path) => {
      const index = mockImages.findIndex((img) => path.includes(img.name));
      return { data: mockPublicUrls[index] };
    });

    const { getByText } = render(<Leaderboard />);

    await waitFor(() => {
      expect(getByText("Leaderboard")).toBeTruthy();
      expect(getByText("User1")).toBeTruthy();
      expect(getByText("User2")).toBeTruthy();
      expect(getByText("User3")).toBeTruthy();
      expect(getByText("User4")).toBeTruthy();
      expect(getByText("User5")).toBeTruthy();
      expect(getByText("User6")).toBeTruthy();
    });
  });

  it("renders default profile image when user has no image", async () => {
    const mockProfiles = [
      { profile_id: "1", name: "User1", discovered_area: 100 },
    ];

    const mockImages: never[] = [];

    (
      supabase
        .from("profiles")
        .select()
        .order("discovered_area", { ascending: false }).limit as jest.Mock
    ).mockResolvedValue({ data: mockProfiles, error: null });
    (supabase.storage.from("profiles").list as jest.Mock).mockResolvedValue({
      data: mockImages,
      error: null,
    });

    const { getByText, getByLabelText } = render(<Leaderboard />);

    await waitFor(() => {
      expect(getByText("Leaderboard")).toBeTruthy();
      expect(getByText("User1")).toBeTruthy();
      expect(getByLabelText("profile-default")).toBeTruthy();
    });
  });
});
