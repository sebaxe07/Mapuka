import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as Icons from "../../assets/icons/home";
import FloatingNavbar from "../components/FloatingNavbar";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import SearchBar from "../components/SearchBar";
import Compass from "../components/Compass";
import MaskedView from "@react-native-masked-view/masked-view";
import NavbarBase from "../../assets/images/navbarbase.svg";
import { colors } from "../../colors";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
import Map from "./MapFog";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home: React.FC = ({ route }: any) => {
  const [text, setText] = useState(""); // Text entered in the search bar
  const [searchText, setSearchText] = useState(""); // Trigger for search
  const [triggerAction, setTriggerAction] = useState(""); // Action triggers (e.g., GPS)
  const [bearing, setBearing] = useState(0); // Compass bearing
  const [externalCoords, setExternalCoords] = useState<[number, number] | null>(
    null
  ); // State to store external coordinates

  // Check for external coordinates passed via `route`
  useEffect(() => {
    if (route?.params?.externalCoordinates) {
      const newCoords = route.params.externalCoordinates;

      // Log the new coordinates
      console.log("Received External Coordinates:", newCoords);
      // Convert to a tuple

      const newCoordsTuple: [number, number] = [
        newCoords.longitude,
        newCoords.latitude,
      ];

      // Update state with new coordinates
      setExternalCoords(newCoordsTuple);

      /*       Alert.alert(
        "New Coordinates Received",
        `Latitude: ${newCoords.latitude}, Longitude: ${newCoords.longitude}`
      ); */
    }
  }, [route?.params?.externalCoordinates]);

  // Handle clearing coordinates if new ones are received later
  useEffect(() => {
    if (externalCoords) {
      console.log("externalCoords:", externalCoords);
      console.log("External coordinates updated. Clearing old register...");
    }
  }, [externalCoords]);
  const [[latitude, longitude], setCoordinates] = useState<[number, number]>([
    0,
    0,
  ]);

  const [changeTheme, setChangeTheme] = useState(false);

  const handleSearch = () => {
    setSearchText(text); // Trigger the search action
    setSearchText(text); // Trigger the search action
  };

  type MapType = "custom" | "dark" | "light";

  const [mapType, setMapType] = useState<MapType>("custom");

  const handleMapCustom = () => {
    setMapType("custom");
  };

  const handleMapDark = () => {
    setMapType("dark");
  };

  const handleMapLight = () => {
    setMapType("light");
  };

  const memoizedTheme = useMemo(
    () => (
      <>
        <MotiView
          animate={{ translateY: changeTheme ? 0 : -60, scale: 0.8 }}
          transition={
            {
              type: "timing",
              duration: 300,
              easing: Easing.linear,
            } as any
          }
        >
          <TouchableOpacity
            className="bg-[#1a1b3f] rounded-full items-center justify-center size-14"
            onPress={handleMapCustom}
          >
            <Icons.Layers fill={"#E8EBFF"} />
          </TouchableOpacity>
        </MotiView>
        <MotiView
          animate={{ translateY: changeTheme ? 0 : -120, scale: 0.8 }}
          transition={
            {
              type: "timing",
              duration: 300,
              easing: Easing.linear,
            } as any
          }
        >
          <TouchableOpacity
            className="bg-[#292929]  rounded-full items-center justify-center size-14"
            onPress={handleMapDark}
          >
            <Icons.Layers fill={"#5E5E5E"} />
          </TouchableOpacity>
        </MotiView>

        <MotiView
          animate={{ translateY: changeTheme ? 0 : -180, scale: 0.8 }}
          transition={
            {
              type: "timing",
              duration: 300,
              easing: Easing.linear,
            } as any
          }
        >
          <TouchableOpacity
            className="bg-white  rounded-full items-center justify-center size-14"
            onPress={handleMapLight}
          >
            <Icons.Layers fill={"#AEAEAE"} />
          </TouchableOpacity>
        </MotiView>
      </>
    ),
    [changeTheme]
  );

  const memoizedCompass = useMemo(
    () => (
      <Compass bearing={bearing} onPress={() => setTriggerAction("north")} />
    ),
    [bearing]
  );

  return (
    <View className="flex-1">
      {/* Full-screen Map */
      /* <Map
        searchText={searchText}
        triggerAction={triggerAction}
        setTriggerAction={setTriggerAction}
        onBearingChange={setBearing}
        mapType={mapType}
        SpotCoordinates={externalCoords}
        setSpotCoordinates={setExternalCoords}
      />

      {/* Search Bar */}
      <View className="absolute inset-0 justify-center items-center   w-full">
        <View className=" w-full h-full px-6  py-16 flex-1 justify-between ">
          {/* TopSection */}
          <View className=" gap-6 ">
            <SearchBar
              value={text}
              onChangeText={(value) => setText(value)}
              placeholder="Search for a location"
              onPress={handleSearch}
            />

            {/* Top Right Buttons */}
            <View className="items-end gap-3">
              <TouchableOpacity
                className="bg-buttonPurple  rounded-full items-center justify-center size-14 z-10"
                onPress={() => setChangeTheme(!changeTheme)}
              >
                <Icons.Layers fill={"#E8EBFF"} />
              </TouchableOpacity>

              {memoizedTheme}

              {/*
               */}
            </View>
          </View>

          {/* Bottom Section */}
          <View className=" gap-10 ">
            {/* Bottom Right Buttons */}

            <View className=" gap-4 items-end">
              <TouchableOpacity
                className="bg-buttonAqua rounded-full items-center justify-center size-14"
                className="bg-buttonAqua rounded-full items-center justify-center size-14"
                onPress={() => setTriggerAction("gps")}
              >
                <Icons.Focus color={colors.white} />
                <Icons.Focus color={colors.white} />
              </TouchableOpacity>

              {memoizedCompass}
            </View>

            {/* Bottom Floating Menu */}
            <FloatingNavbar 
              coordinates = {[latitude, longitude]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
