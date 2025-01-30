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

interface ContentBoxProps {
  title: string;
  description: string;
  unlocked?: boolean;
  layout?: "vertical" | "horizontal";
}

const AchivementBox: React.FC<ContentBoxProps> = ({
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
      ? "flex-row gap-1 px-2 py-5 "
      : "flex-col gap-1 px-5 py-2";

  return (
    <View
      className={`rounded-3xl items-center w-full h-full ${boxStyles} `}
      style={{
        backgroundColor: unlocked ? randomColor : colors.menus,
      }}
    >
      {/* SVG Placeholder */}
      <View className={`flex flex-1 items-center justify-center`}>
        {layout === "horizontal" ? (
          <HolderV width={50} height={80} preserveAspectRatio="none" />
        ) : (
          <HolderH width={70} height={50} preserveAspectRatio="none" />
        )}
      </View>

      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? " gap-2 px-4 " : "items-center py-2"
        } flex-1 justify-center`}
      >
        <Text className="text-bgMain font-senBold text-sm text-wrap text-center">
          {title}
        </Text>
        <Text className="text-textBody font-senRegular text-xs text-center flex-wrap">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default AchivementBox;
