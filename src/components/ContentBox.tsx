import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../colors";
import HolderV from "../../assets/icons/bookmarks/holder.svg";
import HolderH from "../../assets/icons/bookmarks/holderH.svg";
import * as Icons from "../../assets/icons/leaderboard/index";

// Define the array of unlocked colors
const unlockedColors = [
  "#9B3637", // Dark Red
  "#E86C56", // Orange
  "#668DEF", // Blue
  "#5FB5C9", // Aqua
  "#9C65E8", // Purple
];

interface ContentBoxProps {
  category: string;
  title: string;
  description: string;
  unlocked?: boolean;
  top?: string;
  layout?: "vertical" | "horizontal";
}

const ContentBox: React.FC<ContentBoxProps> = ({
  category,
  title,
  description,
  unlocked,
  top = "",
  layout = "vertical",
}) => {
  // Generate a random color for unlocked achievements
  const randomColor =
    unlockedColors[Math.floor(Math.random() * unlockedColors.length)];

  const boxStyles =
    layout === "horizontal"
      ? "flex-row gap-1 px-2 py-5 "
      : "flex-col gap-1 px-5 py-2";

  const renderTrophy = (top: string) => {
    switch (top) {
      case "1":
        return <Icons.Trophy1 width={90} height={90} />;
      case "2":
        return <Icons.Trophy2 width={70} height={90} />;
      case "3":
        return <Icons.Trophy3 width={70} height={90} />;
      default:
        return <Icons.Trophy width={70} height={90} />;
    }
  };

  const renderColor = (top: string) => {
    switch (top) {
      case "1":
        return colors.accentRed;
      case "2":
        return colors.darkRed;
      case "3":
        return colors.orange;
      default:
        return colors.box;
    }
  };

  const renderTextColor = (top: string) => {
    switch (top) {
      case "1":
        return colors.darkRed;
      case "2":
        return colors.orange;
      case "3":
        return colors.darkRed;
      default:
        return colors.lightText;
    }
  };

  return (
    <>
      {category === "achivement" ? (
        <View
          className={`rounded-3xl items-center  w-full h-full ${boxStyles} `}
          style={{
            backgroundColor: unlocked ? randomColor : colors.menus,
          }}
        >
          {/* SVG Placeholder */}
          <View className={`flex items-center justify-center`}>
            {layout === "horizontal" ? (
              <HolderV width={50} height={80} preserveAspectRatio="none" />
            ) : (
              <HolderH width={70} height={50} preserveAspectRatio="none" />
            )}
          </View>

          {/* Text Content */}
          <View
            className={`${
              layout === "horizontal"
                ? "flex-1 gap-2 px-4 py-3"
                : "items-center py-2"
            } justify-center`}
          >
            <Text className="text-bgMain font-senBold text-sm text-wrap text-center">
              {title}
            </Text>
            <Text className="text-textBody font-senRegular text-xs text-center flex-wrap">
              {description}
            </Text>
          </View>
        </View>
      ) : (
        <View
          className={`rounded-3xl items-center  w-full h-full ${boxStyles} `}
          style={{
            backgroundColor: renderColor(top),
          }}
        >
          {/* SVG Placeholder */}
          <View className="flex items-center justify-center">
            {renderTrophy(top)}
          </View>

          {/* Text Content */}
          <View
            className={`${
              layout === "horizontal"
                ? "flex-1 gap-2 px-4 py-3"
                : "items-center py-2"
            } justify-start`}
          >
            <Text
              className={`text-textWhite font-senSemiBold text-${4 - Number(top)}xl text-wrap`}
            >
              {title}
            </Text>
            <Text
              className="text-textBody font-senRegular text-lg  flex-wrap"
              style={{ color: renderTextColor(top) }}
            >
              {description} km
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default ContentBox;
