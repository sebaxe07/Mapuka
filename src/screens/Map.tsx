import React, { Component, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { BlurView } from "expo-blur";
import { Button, Input } from "react-native-elements";
import * as turf from "@turf/turf";
import { Point, Feature, GeoJsonProperties, Polygon, Geometry } from "geojson";
import { Units } from "@turf/turf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchLocation } from "../utils/DirectionsHelper";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface MapProps {}

const fogImageURI = Image.resolveAssetSource(
  require("../../assets/images/fog.png")
).uri;

const Map: React.FC<MapProps> = ({}) => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    null
  );
  const [text, setText] = useState("");
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);

  const useSearch = () => {
    searchLocation({
      text,
      setMarkerLocation,
      cameraRef,
      userLocation,
      setRouteCoords,
    });
  };

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

          // Generate discovery circle and save to storage
          const newDiscovery = generateDiscoveryCircle(coordinates, 150);
          saveDiscoveredArea(newDiscovery);

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

  const [discoveredAreas, setDiscoveredAreas] = useState<
    { longitude: number; latitude: number; radius: number }[]
  >([]);

  const [discoveryCircle, setDiscoveryCircle] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  /*   useEffect(() => {
    loadDiscoveredAreas();
  }, []); */

  const generateDiscoveryCircle = (
    center: number[] | Point | Feature<Point, GeoJsonProperties>,
    radiusInMeters = 1000
  ) => {
    const options = { steps: 64, units: "meters" as Units };
    const circle = turf.circle(center, radiusInMeters, options);
    console.log("Generated circle: ", JSON.stringify(circle, null, 2));
    return circle;
  };

  const saveDiscoveredArea = async (
    area: Feature<Geometry, GeoJsonProperties>
  ) => {
    setDiscoveryCircle(area);
    /*     let existing = await AsyncStorage.getItem("discoveredAreas");
    let areas = existing ? JSON.parse(existing) : [];
    areas.push(area);
    await AsyncStorage.setItem("discoveredAreas", JSON.stringify(areas));
    setDiscoveredAreas(areas); */
  };

  /*   useEffect(() => {
    console.log("Discovered areas: ", JSON.stringify(discoveredAreas));
  }, [discoveredAreas]); */

  useEffect(() => {
    // console.log("Discovery circle: ", JSON.stringify(discoveryCircle, null, 2));
  }, [discoveryCircle]);

  const loadDiscoveredAreas = async () => {
    let storedAreas = await AsyncStorage.getItem("discoveredAreas");
    if (storedAreas) {
      setDiscoveredAreas(JSON.parse(storedAreas));
    }
  };

  return (
    <View className="size-full flex-1 bg-blue-600 justify-center items-center">
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/codekatabattle/cm55m9p3i003b01po2yh31h59/draft"
        compassEnabled={true}
      >
        <MapboxGL.Camera ref={cameraRef} zoomLevel={15} />
        {/* Raster layer for fog effect */}
        <MapboxGL.RasterSource
          id="fogSource"
          tileUrlTemplates={[fogImageURI]}
          tileSize={256}
        >
          <MapboxGL.RasterLayer
            id="fogLayer"
            sourceID="fogSource"
            style={{ rasterOpacity: 0.8, rasterFadeDuration: 500 }}
          />
        </MapboxGL.RasterSource>
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

        <MapboxGL.ShapeSource
          id="circleSource"
          shape={{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [9.145071529409883, 45.51373373651311], // Replace with your coordinates
            },
            properties: {},
          }}
        >
          <MapboxGL.CircleLayer
            id="circleLayer"
            style={{
              circleRadius: 100,
              circleColor: "rgba(0, 0, 0, 0)",
            }}
          />
        </MapboxGL.ShapeSource>

        {discoveryCircle && (
          <MapboxGL.ShapeSource id="discoverySource" shape={discoveryCircle}>
            <MapboxGL.FillLayer
              id="discoveryLayer"
              style={{
                fillColor: "rgba(0, 0, 0, 0)",
                fillOutlineColor: "rgba(255, 0, 0, 1)",
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
        <Button title="Press me" onPress={useSearch} />
        <Button
          title="Clear discovered areas"
          onPress={() => setDiscoveredAreas([])}
        />
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
