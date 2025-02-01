import React, { act } from "react";
import { waitFor, screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../utils/test-utils";
import Achievements from "../Achivements";
import { supabase } from "../../utils/supabase";

// Mock Supabase API
jest.mock("../../utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [{ achievements: JSON.stringify([{ id: 1, unlocked: true }]) }],
          error: null,
        }),
      }),
    })),
  },
}));

jest.mock("../../../assets/icons/bookmarks/holder.svg", () => "HolderV");
jest.mock("../../../assets/icons/bookmarks/holderH.svg", () => "HolderH");
// Mock import * as Icons from "../../../assets/icons/bookmarks/achivements/index";
jest.mock("../../../assets/icons/bookmarks/achivements/index", () => ({
  WelcomeAboard: "WelcomeAboard",
  StickyNotes: "StickyNotes",
  ReturningAdventurer: "ReturningAdventurer",
  NoteTaker: "NoteTaker",
  NightOwl: "NightOwl",
  MemoKeeper: "MemoKeeper",
  FirstSteps: "FirstSteps",
  Explorer: "Explorer",
  EarlyBird: "EarlyBird",
}));

describe("Achievements Screen", () => {
  it("renders achievements screen with Redux state", async () => {
    renderWithProviders(<Achievements />, {
      preloadedState: {
        userData: {
          profile_id: "85c76b",
          achievements: [{ id: 1, unlocked: true }],
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Achievements")).toBeTruthy();
      expect(screen.getByText("Welcome Aboard")).toBeTruthy();
    });
  });

  it("fetches achievements from Supabase and updates state", async () => {
    renderWithProviders(<Achievements />, {
      preloadedState: { userData: { profile_id: "85c76b", achievements: [] } },
    });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("profiles");
    });
  });
});
