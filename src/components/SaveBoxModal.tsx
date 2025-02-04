import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Close from "../../assets/icons/home/close_clean.svg";
import Divider from "./utils/Divider";
import { supabase } from "../utils/supabase";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { setSpots, setNotes } from "../contexts/slices/userDataSlice";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import AlertModal from "./AlertModal";
import Toast from "react-native-toast-message";
import { UpdateAchievements } from "../utils/UserManagement";
import { RFValue } from "react-native-responsive-fontsize";
import InputField from "./InputField";
import { colors } from "../../colors";

interface SaveBoxProps {
  type: "note" | "spot";
  onClose: () => void;
  coordinates: [number, number];
}

const SaveBox: React.FC<SaveBoxProps> = ({ type, onClose, coordinates }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const currentSpots = userData.spots;
  const currentNotes = userData.notes;
  const profileid = userData.profile_id;

  //  console.log("COORDINATES AT SAVEBOX:", coordinates);

  const [showModal, setShowModal] = useState(false);
  console.log("COORDINATES AT SAVEBOX:", coordinates);
  const handleSaveAttempt = () => {
    console.log("\x1b[31m", "Save attempt:", { title, description });
    if (validateInputs()) {
      setShowModal(true);
    } else {
      console.log("Failed to save", type);
    }
  };

  const validateInputs = () => {
    let valid = true;

    if (title.length > 100) {
      setTitleError("Title must be under 100 characters.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (type === "note") {
      if (description.length > 500) {
        setDescriptionError("Description must be under 500 characters.");
        valid = false;
      } else {
        setDescriptionError("");
      }
    }

    return valid;
  };

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
      Toast.show({
        autoHide: true,
        position: "bottom",
        visibilityTime: 2000,
        type: "success",
        text1: `Spot created`,
        text2: `Your ${type} was created successfully!`,
      });
    } else if (type == "note") {
      // Add note to database
      console.log("\x1b[33m", "Adding note:", {
        title,
        coordinates,
        address,
        description,
        profileid,
      });
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            profile_id: profileid,
            coordinates: coordinates,
            address: address,
            title: title,
            content: description,
            image: 1,
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

      // Check if the user has unlocked the "Note Taker" achievement
      if (!userData.achievements[7].unlocked) {
        const updatedAchievements = [...userData.achievements];
        updatedAchievements[7] = { ...updatedAchievements[7], unlocked: true };
        UpdateAchievements(updatedAchievements, profileid, dispatch);

        Toast.show({
          autoHide: true,
          position: "bottom",
          visibilityTime: 5000,
          type: "success",
          text1: "Achievement Unlocked",
          text2: "Note Taker: Create your first note.",
        });
      }

      // Check if the user has unlocked the "Sticky Notes" achievement
      const TotalNotes = [...currentNotes, ...data].length + 1;
      if (TotalNotes >= 5 && !userData.achievements[2].unlocked) {
        const updatedAchievements = [...userData.achievements];
        updatedAchievements[2] = { ...updatedAchievements[2], unlocked: true };
        UpdateAchievements(updatedAchievements, profileid, dispatch);

        Toast.show({
          autoHide: true,
          position: "bottom",
          visibilityTime: 5000,
          type: "success",
          text1: "Achievement Unlocked",
          text2: "Sticky Notes: Create 5 notes.",
        });
      }

      Toast.show({
        autoHide: true,
        position: "bottom",
        visibilityTime: 2000,
        type: "success",
        text1: `Note created`,
        text2: `Your ${type} was created successfully!`,
      });
    }

    console.log(`${type} added successfully:`);

    setShowModal(false);
    onClose(); // Close the modal after saving
  };

  return (
    <View className="absolute bottom-96 self-center w-11/12 bg-textWhite rounded-3xl shadow-lg py-5 px-10">
      <View className="flex-row justify-between items-center mb-4 border-textBody ">
        <Text className="text-textBody text-2xl font-senSemiBold   ">
          {type === "note" ? "Make a Note" : "Save a Spot"}
        </Text>
        <TouchableOpacity testID="close-button" onPress={onClose}>
          <Close />
        </TouchableOpacity>
      </View>
      <Divider />
      {/* Title Input */}
      <InputField
        testID="title-input"
        label="Title"
        labelVisible={title ? true : false}
        placeholder={`Give a Title to your ${type}`}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
        removeBg
        rowWidth="w-full"
        inputClassname="-ml-2"
        placeholderClassname="text-bgMain font-senSemiBold py-2 mb-2  "
        labelClassname="pb-1 pt-3.5 text-xl text-textInput font-senRegular"
        inputColor={colors.background}
        inputFont="SenSemiBold"
      />
      {titleError ? (
        <Text testID="title-error" className="text-buttonAccentRed">
          {titleError}
        </Text>
      ) : null}

      {/* Description Input (only for notes) */}
      {type === "note" ? (
        <>
          <TextInput
            testID="description"
            placeholder="Write a description here..."
            className="text-textBody text-xl font-senMedium pt-2 pb-6 "
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          {descriptionError ? (
            <Text className="text-buttonAccentRed">{descriptionError}</Text>
          ) : null}
        </>
      ) : (
        <View className="pt-4 pb-4"></View>
      )}

      {/* Save Button */}
      <View>
        <TouchableOpacity
          testID="save-button"
          className={`items-center justify-center rounded-full px-3 py-4 w-1/2 ${
            title.trim() && (type !== "note" || description.trim())
              ? "bg-textBody"
              : "bg-textInput"
          }`}
          onPress={handleSaveAttempt}
          disabled={!title.trim() || (type === "note" && !description.trim())}
        >
          <Text className="text-textWhite font-senSemiBold">
            {type === "note" ? "Save Note" : "Save Spot"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert Modal for Confirmation */}
      <AlertModal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        message={`Are you sure you want to save this ${type}?`}
        onCancel={() => setShowModal(false)}
        onConfirm={handleSave}
        confirmText="Save"
        cancelText="Cancel"
      />
    </View>
  );
};

export default SaveBox;
