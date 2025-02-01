import React from "react";
import { View, Text } from "react-native";
import Logo from "../../assets/images/logoMapuka.svg";
import BGDecorator from "../../assets/images/loginBG.svg";
import { MotiView } from "moti";

interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = ({}) => {
  return (
    <View
      testID="splash-screen"
      className="bg-[#11112D] size-full flex items-center justify-center"
    >
      <MotiView
        animate={{
          scale: 2,
          translateY: 200,
        }}
        className="absolute z-0 top-0 left-0 right-0 bottom-0"
      >
        <BGDecorator testID="bg-decorator" />
      </MotiView>
      <Logo testID="logo" />
    </View>
  );
};

export default SplashScreen;
