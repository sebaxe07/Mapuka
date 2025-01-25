import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Place from "../../assets/icons/bookmarks/place.svg";
import SpotDefault from "../../assets/images/bookmarks/spotDefault.svg";
import { colors } from "../../colors";

const SpotBox: React.FC<{
  title: string;
  date: string;
  address: string;
  onPress: () => void;
  image?: string;
}> = ({ title, date: created_at, address: coordinates, onPress, image }) => {
  return (
    <View
      className="flex-row items-center rounded-3xl p-4 px-2 mb-4 bg-boxContainer"
      style={{ minHeight: 130 }} // Adjust height here
    >
      {/* Left Section: SVG or Image */}
      <View className="mr-6 h-full">
        <SpotDefault
        /*  width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet" */
        />
      </View>

      {/* Right Section: Content */}
      <View className="flex-1 justify-around h-auto">
        <View>
          <Text className="text-textBody font-senRegular text-sm mb-1">
            {created_at}
          </Text>
          <Text className="text-textWhite font-senRegular text-xl font-bold mb-2">
            {title}
          </Text>
          <View className="flex-row items-center mb-4">
            <Place
              width={16} // Slightly larger icon
              height={16}
              color={colors.bodyText}
              style={{ marginRight: 8 }} // Add space between icon and text
            />
            <Text className="text-textBody text-sm">{coordinates}</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            className="bg-buttonOrange rounded-full items-center justify-center w-1/3 px-5 py-3"
            onPress={onPress}
          >
            <Text className="text-white text-sm font-senBold">View Spot</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SpotBox;
