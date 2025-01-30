import React from "react";
import { TouchableOpacity } from "react-native";
import Barrow from "../../assets/icons/backArrow.svg";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native-gesture-handler";

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
  const navigation = useNavigation();

  const defaultPress = () => {
    navigation.goBack();
  };

  return (
    <Pressable
      testID="back-arrow"
      onPress={onpress || defaultPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: padding,
      }}
    >
      <Barrow width={size} height={size} />
    </Pressable>
  );
};

export default BackArrow;
