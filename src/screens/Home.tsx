import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import * as Icons from "../../assets/icons/home";
import FloatingNavbar from "../components/FloatingNavbar";
import SearchBar from "../components/SearchBar";
import Compass from "../components/Compass";
import { colors } from "../../colors";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
import Map from "./MapFog";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import Toast from "react-native-toast-message";
import { UpdateAchievements } from "../utils/UserManagement";

interface HomeProps {
  route?: {
    params: {
      externalCoordinates: { latitude: number; longitude: number };
    };
  };
}

const Home: React.FC<HomeProps> = ({ route }: any) => {
  const [text, setText] = useState(""); // Text entered in the search bar
  const [searchText, setSearchText] = useState(""); // Trigger for search
  const [triggerAction, setTriggerAction] = useState(""); // Action triggers (e.g., GPS)
  const [bearing, setBearing] = useState(0); // Compass bearing
  const [externalCoords, setExternalCoords] = useState<[number, number] | null>(
    null
  ); // State to store external coordinates
  const dispatch = useAppDispatch();

  const userData = useAppSelector((state) => state.userData);

  useEffect(() => {
    CheckAchievement();
  }, []);

  const CheckAchievement = () => {
    // Check to time to see if its between 10pm and 12am
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    console.log("Hour: ", hour);
    console.log("Minute: ", minute);
    if (
      hour >= 22 &&
      hour <= 23 &&
      userData.achievements[5].unlocked === false
    ) {
      // Open the app after 10:00 PM
      const updatedAchievements = [...userData.achievements];
      updatedAchievements[5] = { ...updatedAchievements[5], unlocked: true };

      UpdateAchievements(updatedAchievements, userData.profile_id, dispatch);
      Toast.show({
        autoHide: true,
        position: "bottom",
        visibilityTime: 2000,
        type: "success",
        text1: "Achievement Unlocked",
        text2: "Night Owl: Open the app after 10:00 PM.",
      });
    }

    // Check to see if the user has opened the app before 8am
    if (hour >= 0 && hour <= 8 && userData.achievements[6].unlocked === false) {
      // Open the app before 8:00 AM
      const updatedAchievements = [...userData.achievements];
      updatedAchievements[6] = { ...updatedAchievements[6], unlocked: true };

      UpdateAchievements(updatedAchievements, userData.profile_id, dispatch);
      Toast.show({
        autoHide: true,
        position: "bottom",
        visibilityTime: 2000,
        type: "success",
        text1: "Achievement Unlocked",
        text2: "Early Bird: Open the app for the first time before 8:00 AM.",
      });
    }
  };

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
    0, 0,
  ]);

  const [changeTheme, setChangeTheme] = useState(false);

  const handleSearch = () => {
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
            testID="change-default"
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
            testID="change-dark"
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
            testID="change-light"
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
      {/* Full-screen Map */}
      <Map
        searchText={searchText}
        triggerAction={triggerAction}
        setTriggerAction={setTriggerAction}
        onBearingChange={setBearing}
        mapType={mapType}
        SpotCoordinates={externalCoords}
        setSpotCoordinates={setExternalCoords}
        onCoordinatesChange={setCoordinates}
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
                testID="change-theme"
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
                testID="gps"
                className="bg-buttonAqua rounded-full items-center justify-center size-14"
                onPress={() => setTriggerAction("gps")}
              >
                <Icons.Focus color={colors.white} />
              </TouchableOpacity>

              {memoizedCompass}
            </View>

            {/* Bottom Floating Menu */}
            <FloatingNavbar coordinates={[latitude, longitude]} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
