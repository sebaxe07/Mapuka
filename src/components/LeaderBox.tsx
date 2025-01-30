import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../colors";
import HolderV from "../../assets/icons/bookmarks/holder.svg";
import HolderH from "../../assets/icons/bookmarks/holderH.svg";
import * as Icons from "../../assets/icons/leaderboard/index";
import ProfilePic from "./ProfilePic";

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
  image?: string;
  top?: string;
  layout?: "vertical" | "horizontal";
}

const LeaderBox: React.FC<ContentBoxProps> = ({
  user,
  distance,
  image = "https://picsum.photos/200",
  top = "",
  layout = "vertical",
}) => {
  const boxStyles =
    layout === "horizontal"
      ? "flex-row gap-2 px-5 py-5 "
      : "flex-col gap-1 px-5 py-2";

  const renderTrophy = (top: string) => {
    switch (top) {
      case "1":
        return <ProfilePic avatarUrl={image} size={90} crown />;
      case "2":
        return <ProfilePic avatarUrl={image} size={70} border="border-[3px]" />;
      case "3":
        return <ProfilePic avatarUrl={image} size={70} border="border-[3px]" />;
      default:
        return <ProfilePic avatarUrl={image} size={50} border="border-2" />;
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
      <View className="absolute top-4 left-3 size-6 aspect-square bg-boxMenu rounded-full justify-center items-center flex">
        <Text
          className={`font-senBold text-lg  `}
          style={{ color: renderColor(top), lineHeight: 20 }}
        >
          {top}
        </Text>
      </View>
      {/* SVG Placeholder */}
      <View className="flex items-center ">{renderTrophy(top)}</View>
      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? "flex gap-2 px-4 py-3 " : "items-center "
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
