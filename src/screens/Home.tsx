import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as Icons from "../../assets/icons/home";
import FloatingNavbar from "../components/FloatingNavbar";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import SearchBar from "../components/SearchBar";
import Compass from "../components/Compass";
import { colors } from "../../colors";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home: React.FC = ({ route }: any) => {
  const [text, setText] = useState(""); // Text entered in the search bar
  const [searchText, setSearchText] = useState(""); // Trigger for search
  const [triggerAction, setTriggerAction] = useState(""); // Action triggers (e.g., GPS)
  const [bearing, setBearing] = useState(0); // Compass bearing
  const [externalCoords, setExternalCoords] = useState(null); // State to store external coordinates

  // Check for external coordinates passed via `route`
  useEffect(() => {
    if (route?.params?.externalCoordinates) {
      const newCoords = route.params.externalCoordinates;

      // Log the new coordinates
      console.log("Received External Coordinates:", newCoords);

      // Update state with new coordinates
      setExternalCoords(newCoords);

      // Optionally, display an alert to the user
      Alert.alert(
        "New Coordinates Received",
        `Latitude: ${newCoords.latitude}, Longitude: ${newCoords.longitude}`
      );
    }
  }, [route?.params?.externalCoordinates]);

  // Handle clearing coordinates if new ones are received later
  useEffect(() => {
    if (externalCoords) {
      console.log("External coordinates updated. Clearing old register...");
    }
  }, [externalCoords]);

  const handleSearch = () => {
    setSearchText(text); // Trigger the search action
  };

  return (
    <View className="flex-1">
      {/* Full-screen Map */
      /* <Map
        searchText={searchText}
        triggerAction={triggerAction}
        setTriggerAction={setTriggerAction}
        onBearingChange={setBearing}
      /> */}

      {/* Search Bar */}
      <View className="absolute inset-0 justify-center items-center w-full">
        <View className="w-full h-full px-6 py-16 flex-1 justify-between">
          {/* Top Section */}
          <View className="gap-6">
            <SearchBar
              value={text}
              onChangeText={(value) => setText(value)}
              placeholder="Search for a location"
              onPress={handleSearch}
            />

            {/* Top Right Buttons */}
            <View className="items-end">
              <TouchableOpacity className="bg-buttonPurple rounded-full items-center justify-center size-14">
                <Icons.Layers color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="gap-10">
            {/* Bottom Right Buttons */}
            <View className="gap-8 items-end">
              <TouchableOpacity
                className="bg-buttonAqua rounded-full items-center justify-center size-14"
                onPress={() => setTriggerAction("gps")}
              >
                <Icons.Focus color={colors.white} />
              </TouchableOpacity>

              <Compass
                bearing={bearing}
                onPress={() => setTriggerAction("north")}
              />
            </View>

            {/* Bottom Floating Menu */}
            <FloatingNavbar />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
