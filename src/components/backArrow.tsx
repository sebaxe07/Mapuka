import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import Barrow from "../../assets/icons/backArrow.svg";
import { useNavigation } from "@react-navigation/native";

interface BackArrowProps {
  size?: number;
  onpress?: () => void;
  padding?: number;
}

const BackArrow: React.FC<BackArrowProps> = ({
  size = 26,
  onpress,
  padding = 0,
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onpress ? onpress : () => useNavigation().goBack()}
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: padding,
      }}
    >
      <Barrow width={size} height={size} />
    </TouchableOpacity>
  );
};

export default BackArrow;
