import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import * as Icons from "../../assets/icons/home"; // Adjust the path based on your project structure
import { useNavigation } from "@react-navigation/native";
import SaveBox from "./SaveBoxModal"; // Import the ContentBox

const FloatingNavbar: React.FC = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [activeBox, setActiveBox] = useState<"note" | "spot" | null>(null);
  const navigation = useNavigation();

  const handleOptionSelect = (option: "note" | "spot") => {
    setActiveBox(option);
    setMenuExpanded(false); // Collapse the menu
  };

  return (
    <>
      {/* Main Navbar */}
      <View className="absolute bottom-11 self-center w-10/12 h-16 bg-textWhite rounded-3xl shadow-lg flex-row items-center justify-around px-4">
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
            onPress={() => handleOptionSelect("note")}
          >
            <Icons.NewNote color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 rounded-full items-center justify-center"
            onPress={() => handleOptionSelect("spot")}
          >
            <Icons.NewSpot color="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* Content Box */}
      {activeBox && (
        <SaveBox type={activeBox} onClose={() => setActiveBox(null)} />
      )}
    </>
  );
};

export default FloatingNavbar;
