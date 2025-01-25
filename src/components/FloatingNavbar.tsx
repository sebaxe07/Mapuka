import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import * as Icons from "../../assets/icons/home"; // Adjust the path based on your project structure
import { useNavigation } from "@react-navigation/native";
import SaveBox from "./SaveBoxModal"; // Import the ContentBox
import NavbarBase from "../../assets/images/navbarbase.svg";
import MaskedView from "@react-native-masked-view/masked-view";

const FloatingNavbar: React.FC = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [activeBox, setActiveBox] = useState<"note" | "spot" | null>(null);
  const navigation = useNavigation();

  const handleOptionSelect = (option: "note" | "spot") => {
    setActiveBox(option);
    setMenuExpanded(false); // Collapse the menu
  };

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
        {menuExpanded ? (
          <Icons.Close color="white" />
        ) : (
          <Icons.Add color="white" />
        )}
      </TouchableOpacity>
      {/* Expandable Options */}
      {menuExpanded && (
        <View className="absolute bottom-24 self-center flex-row items-center space-x-12">
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
    </View>
  );
};

export default FloatingNavbar;
