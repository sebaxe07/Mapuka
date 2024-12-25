import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";
import Logo from "../../assets/images/ISOTIPO (2).svg";
import MapView, { UrlTile } from "react-native-maps";
import Mapbox from "@rnmapbox/maps";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Mapbox.MapView style={{ flex: 1 }} />
      <Logo width={120} height={40} fill={"green"} />
      <Text>Home </Text>
      <Button onPress={() => navigation.navigate("Details")}>
        Go to Details
      </Button>
      <MapView
        style={{ width: 200, height: 200 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={11} // Adjust zoom level as needed
          flipY={true} // Ensure correct tile orientation
        />
      </MapView>
    </View>
  );
};

export default Home;
