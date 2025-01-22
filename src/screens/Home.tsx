import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import * as Icons from "../../assets/icons/home";
import FloatingNavbar from "../components/FloatingNavbar";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import SearchBar from "../components/SearchBar";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Home: React.FC = () => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    null
  );
  const [menuExpanded, setMenuExpanded] = useState(false);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your location on the map."
        );
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const coordinates: [number, number] = [longitude, latitude];
          setUserLocation(coordinates);
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: coordinates,
              zoomLevel: 16,
              animationDuration: 1000,
            });
          }
        }
      );
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  const handleOptionSelect = (option: string) => {
    console.log("Selected Option:", option);
  };

  return (
    <View className="flex-1">
      {/* Full-screen Map */}
      <MapboxGL.MapView style={{ flex: 1 }} styleURL={MapboxGL.StyleURL.Dark}>
        <MapboxGL.Camera ref={cameraRef} zoomLevel={12} />
        {userLocation && (
          <MapboxGL.PointAnnotation id="userLocation" coordinate={userLocation}>
            <View className="w-3 h-3 bg-blue-500 rounded-full" />
          </MapboxGL.PointAnnotation>
        )}
        {markerLocation && (
          <MapboxGL.PointAnnotation id="marker" coordinate={markerLocation}>
            <View className="w-3 h-3 bg-red-500 rounded-full" />
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>

      {/* Search Bar */}
      <SearchBar />

      {/* Top Right Buttons */}
      <View className="absolute top-20 right-5 space-y-3">
        <TouchableOpacity className="p-3 rounded-full items-center justify-center">
          <Icons.Layers color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Menu */}
      <FloatingNavbar onOptionSelect={handleOptionSelect} />

      {/* Bottom Right Buttons*/}
      <View className="absolute bottom-28 right-5 space-y-3">
        <TouchableOpacity className="bg-black/50 p-3 rounded-full items-center justify-center">
          <Icons.Focus color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-black/50 p-3 rounded-full items-center justify-center">
          <Icons.Compass color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
