import { signInWithEmail, signUpUser, signOut } from "../UserManagement";
import { supabase } from "../supabase";
import { setUserData } from "../../contexts/slices/userDataSlice";
import { Alert } from "react-native";
import { useAppDispatch } from "../../contexts/hooks";

// Mock the dispatch function
const mockDispatch = jest.fn();

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

describe("signInWithEmail", () => {
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
    try {
      const result = await signUpUser({
        email: "testsignup@gmail.com",
        password: "testsignup",
        name: "Test",
        lastname: "Signup",
        dispatch: mockDispatch,
      });

      expect(result).toBeUndefined();
    } finally {
      // clear the user data
      await supabase.from("profiles").delete().eq("lastname", "Signup");
    }
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

  it("signs out successfully", async () => {
    const result = await signOut();

    expect(result).toBeUndefined();
  });
});
