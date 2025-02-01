import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../colors";
import { SvgProps } from "react-native-svg";

// Define the array of unlocked colors
const unlockedColors = [
  "#9B3637", // Dark Red
  "#E86C56", // Orange
  "#668DEF", // Blue
  "#5FB5C9", // Aqua
  "#9C65E8", // Purple
];

// Define corresponding text colors for each background color
const textColors: Record<string, string> = {
  "#9B3637": "#E86C56", // Light Pink for contrast with Dark Red
  "#E86C56": "#9B3637", // Light Cream for contrast with Orange
  "#668DEF": "#11112D", // Light Blue for contrast with Blue
  "#5FB5C9": "#5D6F9D", // Light Cyan for contrast with Aqua
  "#9C65E8": "#27284E", // Light Lavender for contrast with Purple
};

interface ContentBoxProps {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
  unlocked?: boolean;
  layout?: "vertical" | "horizontal";
}

const AchievementBox: React.FC<ContentBoxProps> = ({
  icon: Icon,
  title,
  description,
  unlocked,
  layout = "vertical",
}) => {
  // Generate a random color for unlocked achievements
  const randomColor =
    unlockedColors[Math.floor(Math.random() * unlockedColors.length)];

  // Determine text color based on background
  const textColor = unlocked ? textColors[randomColor] : colors.bodyText;

  const boxStyles =
    layout === "horizontal"
      ? "flex-row gap-1 px-2 py-5"
      : "flex-col gap-1 px-5 py-2";

  return (
    <View
      testID="achivement-box"
      className={`rounded-3xl items-center justify-center w-full h-full ${boxStyles} bg-boxMenu`}
      style={{
        /* backgroundColor: unlocked ? randomColor : colors.menus, */
        //Out of service pretty colors
        opacity: unlocked ? 1 : 0.4, // Apply opacity when locked
      }}
    >
      {/* SVG Icon */}
      <View
        className={`${
          layout === "horizontal" ? "flex-1 " : " "
        }flex items-center justify-center`}
      >
        <Icon
          width={layout === "horizontal" ? 50 : 70}
          height={layout === "horizontal" ? 80 : 50}
        />
      </View>

      {/* Text Content */}
      <View
        className={`${
          layout === "horizontal" ? "flex-1 gap-2 px-4" : "  py-2"
        } justify-center items-center`}
      >
        <Text className={`font-senBold text-sm text-center text-bgMain`}>
          {title}
        </Text>
        <Text
          className={`font-senRegular text-xs text-center ${unlocked ? "text-textBody" : "text-bgMain"}`}
          style={
            {
              /* color: textColor */
            }
          }
        >
          {description},
        </Text>
      </View>
    </View>
  );
};

export default AchievementBox;
