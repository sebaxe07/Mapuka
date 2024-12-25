import React, { Component, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import HeadingIndicator from "@rnmapbox/maps";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});

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
              zoomLevel: 14,
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
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera ref={cameraRef} />

          {userLocation && (
            <MapboxGL.PointAnnotation
              id="userLocation"
              coordinate={userLocation}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: "blue",
                  borderRadius: 15,
                }}
              />
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

export default Map;
