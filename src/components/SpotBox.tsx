import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Place from "../../assets/icons/bookmarks/place.svg";
import SpotDefault from "../../assets/images/bookmarks/spotDefault.svg";
import { colors } from "../../colors";
import { useNavigation } from "@react-navigation/native";

const SpotBox: React.FC<{
  title: string;
  date: string;
  address: string;
  onPress: () => void;
  image?: string;
}> = ({ title, date: created_at, address: coordinates, onPress, image }) => {
  const navigation = useNavigation();

  const externalCoordinates = (latitude: number, longitude: number) => {};

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
          <Text className="text-textWhite font-senMedium text-xl font-bold mb-2">
            {title}
          </Text>
          <View className="flex-row items-center mb-4">
            <Place
              width={16} // Slightly larger icon
              height={16}
              color={colors.bodyText}
              style={{ marginRight: 8 }} // Add space between icon and text
            />
            <Text className="text-textBody font-senRegular text-sm">
              {coordinates}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between w-full">
          <TouchableOpacity
            className="bg-buttonAccentRed rounded-3xl items-center justify-center w-2/3 px-5 py-3"
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
