import { Alert } from "react-native";
import { supabase } from "./supabase";
import { useAppDispatch } from "../contexts/hooks";
import { setUserData, clearUserData } from "../contexts/slices/userDataSlice";
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

interface signInWithEmailProps {
  email: string;
  password: string;
  dispatch: any;
}

export async function signInWithEmail({
  email,
  password,
  dispatch,
}: signInWithEmailProps): Promise<
  void | AuthError | PostgrestError | null | unknown
> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return error;
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
      return error;
    }
    console.log("profiles", profiles);

    // transform the discovered_polygon jsonb to a GeoJSON object
    let discoveredPolygon: Feature<
      Polygon | MultiPolygon,
      GeoJsonProperties
    > | null = null;
    if (profiles?.discovered_polygon) {
      discoveredPolygon = JSON.parse(profiles.discovered_polygon);
    }

    // Dispatch the action to set user data in Redux state
    dispatch(
      setUserData({
        session: data?.session,
        auth: data?.session ? true : false,
        profile_id: profiles?.profile_id,
        email: data.user.email ?? "",
        name: profiles?.name ?? "",
        lastname: profiles?.lastname ?? "",
        discovered_area: profiles?.discovered_area ?? 0,
        discovered_polygon: discoveredPolygon,
        achievements: profiles?.achievements ?? "",
        notes: profiles?.notes ?? [],
        spots: profiles?.spots ?? [],
      })
    );

    console.log("Setting data");
  } catch (error) {
    console.error("Error fetching data:", (error as any).message);
    return error;
  }
}

export const signOut = async () => {
  console.log("Signing out");
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
  dispatch: any;
}

export async function signUpUser({
  email,
  password,
  name,
  lastname,
  dispatch,
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
    signInWithEmail({ email, password, dispatch });
    console.log("User created");
    console.log(data);
  }
}
