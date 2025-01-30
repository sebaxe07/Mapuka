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
  user: string;
  distance: string;
  top?: string;
  layout?: "vertical" | "horizontal";
}

const LeaderBox: React.FC<ContentBoxProps> = ({
  user,
  distance,
  top = "",
  layout = "vertical",
}) => {
  const boxStyles =
    layout === "horizontal"
      ? "flex-row gap-5 px-5 py-5 "
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

  const renderUserClass = (top: string) => {
    switch (top) {
      case "1":
        return `text-4xl`;
      case "2":
        return `text-2xl`;
      case "3":
        return `text-2xl`;
      default:
        return `text-lg`;
    }
  };

  const renderDistanceClass = (top: string) => {
    switch (top) {
      case "1":
        return `text-2xl text-buttonDarkRed`;
      case "2":
        return `text-xl text-buttonOrange`;
      case "3":
        return `text-xl text-buttonDarkRed`;
      default:
        return `text-textBody text-lg`;
    }
  };

  return (
    <View
      testID="leader-box"
      className={`flex rounded-3xl  ${top == "1" ? "items-center justify-center " : " items-center justify-center"} w-full h-full ${boxStyles}`}
      style={{
        backgroundColor: renderColor(top),
      }}
    >
      {/* SVG Placeholder */}
      <View className="flex items-center">{renderTrophy(top)}</View>
      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? "flex-1 gap-2 px-4 py-3" : "items-center "
        } justify-center`}
      >
        <Text
          className={`text-boxMenu ${renderUserClass(top)} font-senMedium text-wrap`}
        >
          {user}
        </Text>
        <Text
          className={`${renderDistanceClass(top)} font-senRegular flex-wrap`}
        >
          {distance} km
        </Text>
      </View>
    </View>
  );
};

export default LeaderBox;
