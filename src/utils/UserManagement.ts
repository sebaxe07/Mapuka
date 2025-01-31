import { Alert } from "react-native";
import { supabase } from "./supabase";
import { useAppDispatch } from "../contexts/hooks";
import {
  setUserData,
  clearUserData,
  Photo,
  Achievement,
} from "../contexts/slices/userDataSlice";
import { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import * as ImagePicker from "expo-image-picker";
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
  //console.log(JSON.stringify(data, null, 2));

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
    //console.log("profiles", profiles);

    // transform the discovered_polygon jsonb to a GeoJSON object
    let discoveredPolygon: Feature<
      Polygon | MultiPolygon,
      GeoJsonProperties
    > | null = null;
    if (profiles?.discovered_polygon) {
      discoveredPolygon = JSON.parse(profiles.discovered_polygon);
    }

    let pic: Photo | null = null;
    // Fetch the user's profile pic from the 'avatars' bucket
    const { data: listdata, error: listerror } = await supabase.storage
      .from("avatars")
      .list(profiles.profile_id);

    if (listerror) {
      console.error("Error fetching list of photos:", listerror.message);
      throw listerror;
    } else if (listdata && listdata.length > 0) {
      //console.log("List of photos:", listdata);

      const imageUrl = await supabase.storage
        .from("avatars")
        .getPublicUrl(profiles.profile_id + "/" + listdata[0].name);

      if (!imageUrl) {
        console.error(
          "Error fetching Public URL for photo:",
          profiles.profile_id + ".jpeg"
        );
      } else if (!imageUrl.data) {
        console.error(
          "Error fetching Public URL for photo:",
          profiles.profile_id + ".jpeg"
        );
      } else {
        // Update the user's profile pic URL in the app
        pic = {
          pictureUrl: imageUrl.data.publicUrl,
          arrayBuffer: "",
          path: profiles.profile_id,
          image: {} as ImagePicker.ImagePickerAsset,
        };
        //console.log("\x1b[32m", "pic URL:", pic.pictureUrl);
      }
    }

    const achievements: Achievement[] = JSON.parse(
      profiles?.achievements ?? "[]"
    );
    /*     // Check if there are any achievements in the database
    if (!profiles?.achievements) {
      // If there are no achievements, create the default achievements
      achievements = await defaultAchievements(profiles.profile_id);
    } */

    // Fetch user spots
    const { data: spotsData, error: spotsError } = await supabase
      .from("spots")
      .select("*")
      .eq("profile_id", profiles.profile_id);
    if (spotsError) {
      console.error("Failed to fetch spots:", spotsError.message);
      return;
    }

    // Fetch user notes
    const { data: notesData, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("profile_id", profiles.profile_id);
    if (notesError) {
      console.error("Failed to fetch notes:", notesError.message);
      return;
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
        achievements: achievements ?? [],
        created_at: profiles?.created_at ?? "",
        pic: pic ?? null,
        notes: notesData ?? [],
        spots: spotsData ?? [],
      })
    );

    // return confirmation of successful login
    return;
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
}: SignUpUserProps): Promise<
  void | AuthError | PostgrestError | null | unknown
> {
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
    return error;
  }

  if (data) {
    console.log("User created");
    //console.log(data);

    return;
  }
}
