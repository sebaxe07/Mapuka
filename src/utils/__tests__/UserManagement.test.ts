import { signInWithEmail, signUpUser, signOut } from "../UserManagement";
import { supabase } from "../supabase";
import { setUserData } from "../../contexts/slices/userDataSlice";
import { Alert } from "react-native";
import { useAppDispatch } from "../../contexts/hooks";
import { AuthError } from "@supabase/supabase-js";

// Mock the dispatch function
const mockDispatch = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("User Management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error if signInWithPassword fails", async () => {
    const result = await signInWithEmail({
      email: "invalid@example.com",
      password: "invalidpassword",
      dispatch: mockDispatch,
    });

    expect(result).toHaveProperty("message");
  });

  it("fetches user profile data and updates Redux state", async () => {
    const result = await signInWithEmail({
      email: "unittest@test.com",
      password: "unittest",
      dispatch: mockDispatch,
    });

    expect(result).toBeUndefined();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "userData/setUserData",
        payload: expect.objectContaining({
          email: "unittest@test.com",
        }),
      })
    );
  });

  it("fetches user profile data and updates Redux state with picture", async () => {
    const result = await signInWithEmail({
      email: "testpic@test.com",
      password: "testpic",
      dispatch: mockDispatch,
    });

    expect(result).toBeUndefined();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "userData/setUserData",
        payload: expect.objectContaining({
          email: "testpic@test.com",
        }),
      })
    );
  });

  it("signs up a user with data", async () => {
    // Mock the signUp method for this test
    const signUpMock = jest.spyOn(supabase.auth, "signUp").mockResolvedValue({
      data: {
        user: {
          id: "00000000-0000-0000-0000-000000000000",
          app_metadata: { provider: "email" },
          user_metadata: {},
          aud: "",
          created_at: "",
        },
        session: null as any,
      },
      error: null,
    });

    const result = await signUpUser({
      email: "testsignup@gmail.com",
      password: "testsignup",
      name: "Test",
      lastname: "Signup",
      dispatch: mockDispatch,
    });

    expect(result).toBeUndefined();
    signUpMock.mockRestore(); // Restore the original method after the test
  });

  it("returns error if signUp fails", async () => {
    const result = await signUpUser({
      email: "test@test.com",
      password: "test",
      name: "Test",
      lastname: "Signup",
      dispatch: mockDispatch,
    });

    expect(result).toHaveProperty("message");
  });

  it("returns error if fetching user profile data fails", async () => {
    const signInMock = jest
      .spyOn(supabase.auth, "signInWithPassword")
      .mockResolvedValue({
        data: {
          user: null,
          session: null as any,
        },
        error: new AuthError("Profile fetch failed"),
      });

    const profileMock = jest
      .spyOn(supabase.from("profiles"), "select")
      .mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Profile fetch failed" },
          }),
        }),
      } as any);

    const result = await signInWithEmail({
      email: "testprofilefail@test.com",
      password: "testprofilefail",
      dispatch: mockDispatch,
    });

    expect(result).toHaveProperty("message", "Profile fetch failed");
    signInMock.mockRestore();
    profileMock.mockRestore();
  });

  it("signs out successfully", async () => {
    const result = await signOut();

    expect(result).toBeUndefined();
  });
});
