import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Close from "../../assets/icons/home/close_clean.svg";

interface SaveBoxProps {
  type: "note" | "spot";
  onClose: () => void;
}

const SaveBox: React.FC<SaveBoxProps> = ({ type, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log("Title:", title);
    console.log("Description:", description);
    onClose(); // Close the modal after saving
  };
  return (
    <View className="absolute bottom-56 self-center w-11/12 bg-textWhite rounded-3xl shadow-lg py-5 px-10">
      <View className="flex-row justify-between items-center mb-4 border-b border-textBody">
        <Text className="text-textBody text-2xl font-SenSemiBoldold mb-4">
          {type === "note" ? "Make a Note" : "Save a Spot"}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Close />
        </TouchableOpacity>
      </View>
      <Text className="text-textInput text-xl font-SenSemiBoldold my-2">
        Title
      </Text>
      <TextInput
        placeholder="Title"
        placeholderClassName="text-boxContainer font-SenSemiBoldold  text-2xl py-2 mb-2"
        value={title}
        className="text-bgMain text-2xl  font-SenSemiBoldold  py-2 mb-2"
        onChangeText={setTitle}
      />
      {type === "note" ? (
        <TextInput
          placeholder="Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla."
          placeholderClassName="text-textBody  text-xl  font-SenMedium   py-2 mb-4"
          value={description}
          className="text-textBody  text-xl font-SenMedium py-2 mb-4"
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      ) : null}
      <View className="flex">
        <TouchableOpacity
          className="bg-textBody items-center justify-center rounded-full px-3 py-4 w-1/2"
          onPress={handleSave}
        >
          <Text className="text-textWhite font-senBold text-center">
            {type === "note" ? "Save Note" : "Save Spot"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaveBox;
