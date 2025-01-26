import React from "react";
import { Button, TextInput, View } from "react-native";
import { Search } from "../../assets/icons/home";
import { Input } from "react-native-elements";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search",
  onPress,
}) => {
  return (
    <View className="bg-boxMenu rounded-2xl shadow-lg flex-row items-center justify-center p-4 mx-4">
      <Search color="#aaa" />
      <TextInput
        className="ml-2 flex-1 text-bgMain font-senRegular"
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onPress}
      />
      {/* <Input
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
      />
      <Button title="Press me" onPress={onPress} /> */}
    </View>
  );
};

export default SearchBar;
