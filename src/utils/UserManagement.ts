import { Alert } from "react-native";
import { supabase } from "./supabase";

interface signInWithEmailProps {
  email: string;
  password: string;
}

export async function signInWithEmail({
  email,
  password,
}: signInWithEmailProps): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    Alert.alert(error.message);
    console.error("Error sign message", error.message);
    console.error("Error sign error", error);

    return;
  }
  console.log(JSON.stringify(data, null, 2));

  // Fetch user profile data from the 'profiles' table
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id_rel", data.user.id)
      .single();

    if (error) {
      console.error("Error fetching profiles:", error.message);
      return;
    }
    console.log("profiles", profiles);

    console.log("Setting data");
  } catch (error) {
    console.error("Error fetching todos:", (error as any).message);
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    return;
  }

  console.log("Logged out");
};

interface SignUpUserProps {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export async function signUpUser({
  email,
  password,
  name,
  lastname,
}: SignUpUserProps): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
        lastname: lastname,
      },
    },
  });

  if (error) {
    Alert.alert(error.message);
    return;
  }

  if (data) {
    signInWithEmail({ email, password });
    console.log("User created");
    console.log(data);
  }
}
