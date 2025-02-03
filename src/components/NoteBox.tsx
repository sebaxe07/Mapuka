import React from "react";
import { View, Text } from "react-native";
import * as NoteBg from "../../assets/images/bookmarks/index";
import Place from "../../assets/icons/bookmarks/place.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../colors";

const NoteBox: React.FC<{
  title: string;
  date: string;
  address: string;
  onPress: () => void;
  styleVariant: number;
}> = ({ title, date, address, onPress, styleVariant }) => {
  const Backgrounds = [
    NoteBg.Style1,
    NoteBg.Style2,
    NoteBg.Style3,
    NoteBg.Style4,
    NoteBg.Style5,
    NoteBg.Style6,
  ];
  const Background = Backgrounds[styleVariant];

  return (
    <TouchableOpacity onPress={onPress}>
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
            <Text className="text-textBody font-senRegular text-base mb-1">
              {date}
            </Text>
            <Text className="text-boxContainer text-4xl font-senMedium mb-1">
              {title}
            </Text>
            <View className="flex-row items-center mb-4">
              <Place
                testID="place-icon"
                width={16}
                height={16}
                color={"--color-text-body"}
                style={{ marginRight: 8 }}
              />
              <Text className="text-textBody font-senRegular text-base">
                {address}
              </Text>
            </View>
          </View>
          <View className="">
            <TouchableOpacity
              style={{
                backgroundColor: colors.accentRed,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999, // Fully rounded
                paddingHorizontal: 12,
                paddingVertical: 12,
                width: "33.33%",
              }}
              onPress={onPress}
            >
              <Text className="text-textWhite text-sm font-senSemiBold">
                Open Note
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NoteBox;
