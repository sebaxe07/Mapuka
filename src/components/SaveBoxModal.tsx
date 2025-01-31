import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Close from "../../assets/icons/home/close_clean.svg";
import Divider from "./utils/Divider";
import { supabase } from "../utils/supabase";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { setSpots, setNotes } from "../contexts/slices/userDataSlice";
import { MAPBOX_ACCESS_TOKEN } from "@env";

interface SaveBoxProps {
  type: "note" | "spot";
  onClose: () => void;
  coordinates: [number, number];
}

const SaveBox: React.FC<SaveBoxProps> = ({ type, onClose, coordinates }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const currentSpots = userData.spots;
  const currentNotes = userData.notes;
  const profileid = userData.profile_id;
  console.log("COORDINATES AT SAVEBOX:", coordinates);

  const handleSave = async () => {
    // Get actual name address from Mapbox API
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coordinates[0]}&latitude=${coordinates[1]}&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const addressData = await response.json();
    const address =
      addressData.features[0]?.properties?.name || "Unknown address";

    if (type == "spot") {
      console.log("Adding spot:", { title, coordinates, address, profileid });

      // Add spot to database
      const { data, error } = await supabase
        .from("spots")
        .insert([
          {
            profile_id: profileid,
            coordinates: coordinates,
            title: title,
            address: address,
          },
        ])
        .select();

      if (error) {
        console.error("Failed to add spot:", error.message);
        return;
      }
      console.log("Spot added successfully:", data);

      // Add spot to local context
      dispatch(setSpots([...currentSpots, ...data]));

      onClose(); // Close the modal after saving
    } else if (type == "note") {
      console.log("Adding spot:", {
        title,
        description,
        coordinates,
        address,
        profileid,
      });

      // Add note to database
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            profile_id: profileid,
            coordinates: coordinates,
            address: address,
            title: title,
            content: description,
          },
        ])
        .select();

      if (error) {
        console.error("Failed to add note:", error.message);
        return;
      }
      console.log("Note added successfully:", data);

      dispatch(setNotes([...currentNotes, ...data]));

      onClose(); // Close the modal after saving
    }
  };

  return (
    <View className="absolute bottom-56 self-center w-11/12 bg-textWhite rounded-3xl shadow-lg py-5 px-10">
      <View className="flex-row justify-between items-center mb-4 border-textBody ">
        <Text className="text-textBody text-2xl font-senSemiBold   ">
          {type === "note" ? "Make a Note" : "Save a Spot"}
        </Text>
        <TouchableOpacity testID="close-button" onPress={onClose}>
          <Close />
        </TouchableOpacity>
      </View>
      <Divider />
      <Text className="text-textInput text-xl font-senSemiBold my-2">
        Title
      </Text>
      <TextInput
        placeholder="Title"
        placeholderClassName="text-boxContainer font-senSemiBold  text-2xl py-2 mb-2"
        value={title}
        className="text-bgMain text-2xl  font-senSemiBold  py-2 mb-2"
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        placeholderClassName="text-textBody  text-xl  font-medium  py-2 mb-4"
        value={description}
        className="text-textBody  text-xl font-senMedium py-2 mb-4"
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <View className="">
        <TouchableOpacity
          testID="save-button"
          className="bg-textBody items-center justify-center rounded-full px-3 py-4 w-1/2"
          onPress={handleSave}
        >
          <Text className="text-textWhite font-senSemiBold">
            {type === "note" ? "Save Note" : "Save Spot"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaveBox;
