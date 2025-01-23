import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as NoteBg from "../../assets/images/bookmarks/index";
import Place from "../../assets/icons/bookmarks/place.svg";

const NoteBox: React.FC<{
  title: string;
  date: string;
  address: string;
  onPress: () => void;
  styleVariant: number;
}> = ({ title, date, address, onPress, styleVariant }) => {
  const Backgrounds = [
    NoteBg.Style0,
    NoteBg.Style1,
    NoteBg.Style2,
    NoteBg.Style3,
    NoteBg.Style4,
    NoteBg.Style5,
  ];
  const Background = Backgrounds[styleVariant];

  return (
    <View
      className="relative rounded-3xl overflow-hidden bg-white h-[260px] mb-4"
      style={{ minHeight: 260 }} // Doubling the minimum height inline
    >
      {Background && (
        <Background
          style={{ position: "absolute", top: 0, left: 0 }}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
      )}
      <View className="flex-1 justify-around px-4 py-2">
        <View className="">
          <Text className="text-textBody text-base mb-1">{date}</Text>
          <Text className="text-boxContainer text-4xl font-medium mb-1">
            {title}
          </Text>
          <View className="flex-row items-center mb-4">
            <Place
              width={16}
              height={16}
              color={"--color-text-body"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-textBody text-base">{address}</Text>
          </View>
        </View>
        <View className="">
          <TouchableOpacity
            className="bg-buttonOrange items-center justify-center rounded-full px-3 py-3 w-1/3"
            onPress={onPress}
          >
            <Text className="text-textWhite text-sm font-bold">Open Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NoteBox;