import React, { useEffect, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { MotiView, useAnimationState } from "moti";
import * as Icons from "../../assets/icons/home";
import { Easing } from "react-native-reanimated";

interface CompassProps {
  bearing: number;
  onPress: () => void;
}

const Compass = ({ bearing, onPress }: CompassProps) => {
  // Offset to adjust for the icon misalignment (tweak as needed)
  const BEARING_OFFSET = -35; // Adjust this value to fine-tune alignment

  // Define animation states
  const animationState = useAnimationState({
    from: {
      rotate: `${BEARING_OFFSET}deg`,
    },
    to: {
      rotate: `${-bearing + BEARING_OFFSET}deg`,
    },
  });

  // Throttle the bearing updates
  useEffect(() => {
    animationState.transitionTo("to");
  }, [bearing]);

  const memoizedMotiView = useMemo(
    () => (
      <MotiView
        state={animationState}
        transition={
          {
            type: "timing",
            duration: 0,
            easing: Easing.linear,
          } as any
        }
      >
        <Icons.Compass color="white" />
      </MotiView>
    ),
    [animationState]
  );

  return (
    <TouchableOpacity
      testID="compass"
      className="bg-buttonBlue rounded-full items-center justify-center size-14"
      onPress={onPress}
    >
      {memoizedMotiView}
    </TouchableOpacity>
  );
};

export default Compass;
