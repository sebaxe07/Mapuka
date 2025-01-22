import React from "react";
import { TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Search } from "../../assets/icons/home";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search" }) => {
  return (
    <View className="absolute w-3/4 top-5 left-0 right-0 bg-white rounded-3xl shadow-lg flex-row items-center justify-center p-4">
      <Search color="#aaa" />
      <TextInput
        className="ml-2 flex-1 text-black"
        placeholder={placeholder}
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

export default SearchBar;
