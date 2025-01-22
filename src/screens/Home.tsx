import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, ImageBackground } from "react-native";
import Logo from "../../assets/images/ISOTIPO (2).svg";
import MapView, { UrlTile } from "react-native-maps";

import { BlurView } from "expo-blur";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const navigation = useNavigation();

  const image = require("../../assets/images/mapBgDark.png");
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ImageBackground
        source={image}
        className="size-full flex-1 justify-center items-center"
      >
        <Logo width={120} height={40} fill={"green"} />
        <Text>Home Screen</Text>
        <Button onPress={() => navigation.navigate("Details")}>
          Go to Details
        </Button>
        <Button onPress={() => navigation.navigate("Map")}>Go to Map</Button>
        <Button onPress={() => navigation.navigate("MapFog")}>
          Go to MapFog
        </Button>
        <BlurView
          intensity={10}
          tint="light"
          className="h-20 w-4/5 rounded-2xl overflow-hidden justify-center items-center border border-white"
          experimentalBlurMethod="dimezisBlurView"
        >
          <View>
            <Text className="text-center text-white">Soy borroso</Text>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );
};

export default Home;
