import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
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
  const [text, setText] = useState("");
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

  const searchLocation = async () => {
    console.log("Search location");
    if (!text) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;

        setMarkerLocation([longitude, latitude]);
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      } else {
        Alert.alert("No results found", "Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location: ", error);
      Alert.alert("Error", "Failed to fetch location. Please try again.");
    }
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
      <SearchBar
        value={text}
        onChangeText={(value) => setText(value)}
        placeholder="Search for a location"
        onPress={searchLocation}
      />

      {/* Top Right Buttons */}
      <View className="absolute top-32 right-5 space-y-3">
        <TouchableOpacity className="bg-buttonPurple p-3 rounded-full items-center justify-center">
          <Icons.Layers color="var(--color-text-white)" />
        </TouchableOpacity>
      </View>

      {/* Bottom Floating Menu */}
      <FloatingNavbar />

      {/* Bottom Right Buttons */}
      <View className="absolute bottom-32 right-5">
        <TouchableOpacity
          className="bg-buttonAqua p-3 rounded-full items-center justify-center mb-6" // Adjusted margin-bottom
          onPress={searchLocation}
        >
          <Icons.Focus color="var(--color-text-white)" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-buttonBlue p-3 rounded-full items-center justify-center">
          <Icons.Compass color="var(--color-text-white)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
