import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";
import Logo from "../../assets/images/ISOTIPO (2).svg";
import MapView, { UrlTile } from "react-native-maps";
import Mapbox from "@rnmapbox/maps";

interface HomeProps {}

Mapbox.setAccessToken(
  "pk.eyJ1IjoiY29kZWthdGFiYXR0bGUiLCJhIjoiY201NDUwazd5MTdlNDJvc2VvMjU1Z2dnMSJ9.H5y4T1mhK2AngJnnBYN_Bg"
);

const Home: React.FC<HomeProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Logo width={120} height={40} fill={"green"} />
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("Details")}>
        Go to Details
      </Button>
      <Button onPress={() => navigation.navigate("Map")}>Go to Map</Button>
    </View>
  );
};

export default Home;
