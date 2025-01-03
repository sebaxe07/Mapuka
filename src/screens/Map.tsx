import React, { Component, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { BlurView } from "expo-blur";
import { Button, Input } from "react-native-elements";

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

  const [text, setText] = useState("");

  useEffect(() => {
    console.log("text", text);
  }, [text]);

  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);

  const searchLocation = async () => {
    console.log("Button pressed");
    if (!text) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          text
        )}&proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;

        // Update the map camera to focus on the searched location
        setMarkerLocation([longitude, latitude]);
        if (cameraRef.current) {
          cameraRef.current.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
        traceRouteToMarker([longitude, latitude]);
      } else {
        Alert.alert("No results found", "Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location: ", error);
      Alert.alert("Error", "Failed to fetch location. Please try again.");
    }
  };

  const traceRouteToMarker = async (destination: [number, number]) => {
    if (!userLocation) {
      Alert.alert("User location not found", "Cannot trace a route.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?alternatives=false&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry.coordinates;
        setRouteCoords(route);
      } else {
        Alert.alert("No route found", "Could not trace a route.");
      }
    } catch (error) {
      console.error("Error tracing route: ", error);
      Alert.alert("Error", "Failed to trace route. Please try again.");
    }
  };

  return (
    <View className="size-full flex-1 bg-blue-600 justify-center items-center">
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/codekatabattle/cm55m9p3i003b01po2yh31h59/draft"
        compassEnabled={true}
      >
        <MapboxGL.Camera ref={cameraRef} />
        {UserLocation && (
          <MapboxGL.LocationPuck
            puckBearing={"course"}
            pulsing={{ isEnabled: true, color: "blue", radius: "accuracy" }}
          />
        )}
        {markerLocation && (
          <MapboxGL.PointAnnotation id="marker" coordinate={markerLocation}>
            <View className="size-4 bg-red-500" />
          </MapboxGL.PointAnnotation>
        )}
        {routeCoords && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
              properties: {},
            }}
          >
            <MapboxGL.LineLayer
              id="routeLine"
              style={{
                lineWidth: 5,
                lineColor: "#007AFF",
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      <View className="size-full relative items-center ">
        <Input
          placeholder="BASIC INPUT"
          onChangeText={(value) => setText(value)}
          value={text}
        />
        <Button title="Press me" onPress={searchLocation} />
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
