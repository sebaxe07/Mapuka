import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../colors";
import Holder from "../../assets/icons/bookmarks/holder.svg";

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
      className={`rounded-lg ${boxStyles}`}
      style={{
        backgroundColor: unlocked ? randomColor : colors.white, // Use random color if unlocked
      }}
    >
      {/* SVG Placeholder */}
      <View
        style={{
          width: layout === "horizontal" ? "30%" : "100%",
          height: layout === "horizontal" ? "100%" : 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Holder
          width={layout === "horizontal" ? 40 : "70%"}
          height={layout === "horizontal" ? "70%" : 40}
          fill={unlocked ? colors.bodyText : colors.white} // Adjust color for the SVG
        />
      </View>

      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? "flex-1" : "items-center"
        } justify-center`}
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
