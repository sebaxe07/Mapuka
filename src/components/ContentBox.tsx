import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../colors";
import HolderV from "../../assets/icons/bookmarks/holder.svg";
import HolderH from "../../assets/icons/bookmarks/holderH.svg";

// Define the array of unlocked colors
const unlockedColors = [
  "#9B3637", // Dark Red
  "#E86C56", // Orange
  "#668DEF", // Blue
  "#5FB5C9", // Aqua
  "#9C65E8", // Purple
];

const AchievementBox = ({
  title,
  description,
  unlocked,
  layout = "vertical",
}) => {
  // Generate a random color for unlocked achievements
  const randomColor =
    unlockedColors[Math.floor(Math.random() * unlockedColors.length)];

  const boxStyles =
    layout === "horizontal"
      ? "flex-row items-center p-3 space-x-4"
      : "flex-col items-center p-3 space-y-2";

  return (
    <View
      className={`rounded-3xl ${boxStyles}`}
      style={{
        backgroundColor: unlocked ? randomColor : colors.white,
      }}
    >
      {/* SVG Placeholder */}
      <View className={`flex items-center justify-center`}>
        {layout === "horizontal" ? (
          <HolderV width={50} height={90} preserveAspectRatio="none" />
        ) : (
          <HolderH width={80} height={50} preserveAspectRatio="none" />
        )}
      </View>

      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? "flex-1" : "items-center"
        } justify-center p-4`}
      >
        <Text
          className="text-bgMain font-senBold text-sm text-center"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-textBody text-xs text-center flex-wrap">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default AchievementBox;
