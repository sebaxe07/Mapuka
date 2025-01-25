import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Close from "../../assets/icons/home/close_clean.svg";
import Divider from "./utils/Divider";

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
      <View className="flex-row justify-between items-center mb-4 border-textBody ">
        <Text className="text-textBody text-2xl font-senSemiBold   ">
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
        placeholderClassName="text-boxContainer font-senSemiBold  text-2xl py-2 mb-2"
        value={title}
        className="text-bgMain text-2xl  font-senSemiBold  py-2 mb-2"
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Etiam vitae augue ultrices, efficitur lectus et, malesuada nulla."
        placeholderClassName="text-textBody  text-xl  font-medium  py-2 mb-4"
        value={description}
        className="text-textBody  text-xl font-senMedium py-2 mb-4"
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <View className="">
        <TouchableOpacity
          className="bg-textBody items-center justify-center rounded-full px-3 pb-2 py-3 w-1/3"
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
