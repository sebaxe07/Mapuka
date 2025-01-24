import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Icons from "../../assets/icons/home";

interface CompassProps {
  bearing: number;
  onPress: () => void;
}

const Compass = ({ bearing, onPress }: CompassProps) => {
  // Offset to adjust for the icon misalignment (tweak as needed)
  const BEARING_OFFSET = -35; // Adjust this value to fine-tune alignment

  // Shared value to store the compass rotation angle
  const rotation = useSharedValue(0);

  // Update rotation with the adjusted offset
  useEffect(() => {
    rotation.value = withTiming(-bearing + BEARING_OFFSET, {
      duration: 0, // Reduce duration for quicker response
      easing: Easing.linear,
    });
  }, [bearing]);

  // Animated style for rotating the compass
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      className="bg-buttonBlue rounded-full items-center justify-center size-14"
      onPress={onPress}
    >
      <Animated.View style={animatedStyle}>
        <Icons.Compass color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Compass;
