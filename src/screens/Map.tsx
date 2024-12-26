import React, { Component, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import LocationPuck from "@rnmapbox/maps";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface MapProps {}

const Map: React.FC<MapProps> = ({}) => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
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

          // Focus camera on the user's location
          if (cameraRef.current) {
            cameraRef.current.setCamera({
              centerCoordinate: coordinates,
              zoomLevel: 16,
              animationDuration: 1000, // Smooth transition
            });
          }
        }
      );
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  return (
    <View className="size-full flex-1 bg-blue-600 justify-center items-center">
      <View className="size-full bg-fuchsia-400">
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/dark-v11"
          compassEnabled={true}
        >
          <MapboxGL.Camera ref={cameraRef} />
          {UserLocation && (
            <MapboxGL.LocationPuck
              puckBearing={"course"}
              pulsing={{ isEnabled: true, color: "blue", radius: "accuracy" }}
            />
          )}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

export default Map;
