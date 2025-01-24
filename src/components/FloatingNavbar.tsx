import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import * as Icons from "../../assets/icons/home"; // Adjust the path based on your project structure
import { useNavigation } from "@react-navigation/native";

// New imports
import { supabase } from "../utils/supabase";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { Note, setNotes, setSpots, Spot } from "../contexts/slices/userDataSlice";


interface FloatingNavbarProps {
  onOptionSelect?: (option: string) => void;
}

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

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ onOptionSelect }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const navigation = useNavigation();
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const handleOptionSelect = (option: string) => {
    onOptionSelect?.(option);
    setMenuExpanded(false); // Collapse the menu after selection
    
    if (option === "newFavorite") {
      // Add new spot to database
      console.log("ADDING NEW SPOT");

      const currentSpots = userData.spots;

      // TODO: UNCOMMENT WHEN THERE IS AN ACTUAL PROFILE ID IN THE STATE.
      // const profileid = userData.profile_id
      // TODO: FETCH ACTUAL COORDINATES

      // TODO: INTEGRATE WITH FORM
      addSpot("6ce0ce", 1, "Duomo", dispatch, currentSpots);

      console.log("LOCAL SPOTS AFTER ADDING: ", userData.spots);

  } else if(option == "newNote") {
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
    <>
      {/* Main Navbar */}
      <View className="absolute bottom-11 self-center w-10/12 h-16 bg-boxContainer rounded-3xl shadow-lg flex-row items-center justify-around px-4">
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

        {/* Middle Button */}
        <TouchableOpacity
          className="w-16 h-16 items-center justify-center shadow-lg -mt-16"
          onPress={() => setMenuExpanded(!menuExpanded)}
        >
          {menuExpanded ? (
            <Icons.Close color="white" />
          ) : (
            <Icons.Add color="white" />
          )}
        </TouchableOpacity>

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

      {/* Expandable Options */}
      {menuExpanded && (
        <View className="absolute bottom-32 self-center flex-row items-center space-x-12">
          <TouchableOpacity
            className="p-3 rounded-full items-center justify-center"
            onPress={() => handleOptionSelect("newFavorite")}
          >
            <Icons.NewFavorite color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 rounded-full items-center justify-center"
            onPress={() => handleOptionSelect("newNote")}
          >
            <Icons.NewNote color="black" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default FloatingNavbar;
