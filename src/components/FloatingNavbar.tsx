import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import * as Icons from "../../assets/icons/home"; // Adjust the path based on your project structure
import { useNavigation } from "@react-navigation/native";

// New imports
import { supabase } from "../utils/supabase";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { Note, setNotes, setSpots, Spot } from "../contexts/slices/userDataSlice";

import SaveBox from "./SaveBoxModal"; // Import the ContentBox
import NavbarBase from "../../assets/images/navbarbase.svg";
import MaskedView from "@react-native-masked-view/masked-view";
import { MotiView } from "moti";

const addSpot = async(profileid: String, coordinates: number, title: String, dispatch: any, currentSpots: Spot[]) => {
  console.log('Adding spot:', { profileid, coordinates, title });
  const { data, error } = await supabase
    .from("spots")
    .insert([
      {
        profile_id: profileid,
        coordinates: coordinates,
        title: title
      }

    ])
    .select();

    console.log("SPOTS: Made it this far.")
    if (error) {
      console.error("Failed to add spot:", error.message);
      return;
    }
    console.log("Spot added successfully:", data);

    // Add spot to local context
    dispatch(setSpots([...currentSpots, ...data]));

}

const addNote = async(
  profileid: String, coordinates: number, 
  title: String, content: String,
  image_url: String, 
  dispatch: any, currentNotes: Note[]
) => {
  console.log("Adding note: ", {profileid, coordinates, title, content, image_url});

  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        profile_id: profileid,
        coordinates: coordinates,
        title: title,
        content: content,
        image_url: image_url
      }
    ])
    .select();

    console.log("NOTES: Made it this far.")
    if (error) {
      console.error("Failed to add note:", error.message);
      return;
    }
    console.log("Note added successfully:", data);

    // Add spot to local context
    dispatch(setNotes([...currentNotes, ...data]));
}

const FloatingNavbar: React.FC = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [activeBox, setActiveBox] = useState<"note" | "spot" | null>(null);
  const navigation = useNavigation();
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const handleOptionSelect = (option: "note" | "spot") => {
    setActiveBox(option);
    setMenuExpanded(false); // Collapse the menu
    
    if (option === "spot") {
      // Add new spot to database
      console.log("ADDING NEW SPOT");

      const currentSpots = userData.spots;

      // TODO: UNCOMMENT WHEN THERE IS AN ACTUAL PROFILE ID IN THE STATE.
      // const profileid = userData.profile_id
      // TODO: FETCH ACTUAL COORDINATES

      // TODO: INTEGRATE WITH FORM
      addSpot("6ce0ce", 1, "Duomo", dispatch, currentSpots);

      console.log("LOCAL SPOTS AFTER ADDING: ", userData.spots);

  } else if(option == "note") {
      console.log("ADDING NEW NOTE");
      // TODO: UNCOMMENT WHEN THERE IS AN ACTUAL PROFILE ID IN THE STATE.
      // const profileid = userData.profile_id
      // TODO: FETCH ACTUAL COORDINATES

      // TODO: INTEGRATE WITH FORM
      const currentNotes = userData.notes;
      addNote("6ce0ce", 1, "Duomo", "I love the Duomo", "bit.ly/something", dispatch, currentNotes);

      console.log("LOCAL NOTES AFTER ADDING: ", userData.notes);
  };
}

  return (
    <View className="  justify-center items-center ">
      {/* Main Navbar */}
      <MaskedView
        style={{ width: "auto" }}
        maskElement={
          <View className="flex items-center justify-center">
            <NavbarBase />
          </View>
        }
      >
        {/* The background content (colored rectangle) */}

        <View className="self-center mx-4 h-[4.5rem] bg-boxMenu rounded-3xl shadow-lg flex-row items-center justify-around<">
          {/* Left Buttons */}
          <TouchableOpacity
            className="flex-1 items-center justify-center"
            onPress={() => navigation.navigate("Achivements")}
          >
            <Icons.Achivements color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center"
            onPress={() => navigation.navigate("Leaderboard")}
          >
            <Icons.Leaderboard color="black" />
          </TouchableOpacity>
          <View className="size-20" />
          {/* Right Buttons */}
          <TouchableOpacity
            className="flex-1 items-center justify-center"
            onPress={() => navigation.navigate("Bookmarks")}
          >
            <Icons.Favorites color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center"
            onPress={() => navigation.navigate("Profile")}
          >
            <Icons.Profile color="black" />
          </TouchableOpacity>
        </View>
      </MaskedView>

      {/* Middle Button */}
      <TouchableOpacity
        className="w-16 h-16 items-center justify-center shadow-lg  absolute -top-8 left-1/2 transform -translate-x-1/2"
        onPress={() => setMenuExpanded(!menuExpanded)}
      >
        <MotiView
          animate={{ rotate: menuExpanded ? "45deg" : "0deg" }}
          transition={{ type: "timing", duration: 200 } as any}
        >
          <Icons.Add color="white" />
        </MotiView>
      </TouchableOpacity>
      {/* Expandable Options */}
      <MotiView
        animate={{
          scale: menuExpanded ? 1 : 0,
        }}
        className="absolute bottom-24 self-center flex-row items-center space-x-12"
      >
        <TouchableOpacity
          disabled={!menuExpanded}
          className="p-3 rounded-full items-center justify-center "
          onPress={() => handleOptionSelect("note")}
        >
          <Icons.NewNote color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!menuExpanded}
          className="p-3 rounded-full items-center justify-center "
          onPress={() => handleOptionSelect("spot")}
        >
          <Icons.NewSpot color="black" />
        </TouchableOpacity>
      </MotiView>

      {/* Content Box */}
      {activeBox && (
        <SaveBox type={activeBox} onClose={() => setActiveBox(null)} />
      )}
    </View>
  );
};

export default FloatingNavbar;
