import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Close from "../../assets/icons/home/close_clean.svg";
import Divider from "./utils/Divider";
import AlertModal from "./AlertModal";

interface SaveBoxProps {
  type: "note" | "spot";
  onClose: () => void;
}

const SaveBox: React.FC<SaveBoxProps> = ({ type, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSaveAttempt = () => {
    setShowModal(true); // Show confirmation modal
  };

  const handleConfirmSave = () => {
    console.log("Title:", title);
    console.log("Description:", description);
    setShowModal(false);
    onClose(); // Close the modal after saving
  };

  return (
    <View className="absolute bottom-56 self-center w-11/12 bg-textWhite rounded-3xl shadow-lg py-5 px-10">
      <View className="flex-row justify-between items-center mb-4 border-textBody">
        <Text className="text-textBody text-2xl font-senSemiBold">
          {type === "note" ? "Make a Note" : "Save a Spot"}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Close />
        </TouchableOpacity>
      </View>
      <Divider />
      <Text className="text-textInput text-xl font-senSemiBold my-2">
        Title
      </Text>
      <TextInput
        placeholder="Title"
        value={title}
        className="text-bgMain text-2xl font-senSemiBold py-2 mb-2"
        onChangeText={setTitle}
      />
      {type === "note" && (
        <TextInput
          placeholder="Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla."
          value={description}
          className="text-textBody text-xl font-senMedium py-2 mb-4"
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      )}
      <View className="">
        <TouchableOpacity
          className="bg-textBody items-center justify-center rounded-full px-3 py-4 w-1/2"
          onPress={handleSaveAttempt} // Trigger modal instead of direct save
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
        onConfirm={handleConfirmSave}
        confirmText="Save"
        cancelText="Cancel"
      />
    </View>
  );
};

export default SaveBox;
