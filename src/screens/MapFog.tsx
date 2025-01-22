import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { BlurView } from "expo-blur";
import { Button, Input } from "react-native-elements";
import * as turf from "@turf/turf";
import {
  Point,
  Feature,
  GeoJsonProperties,
  Polygon,
  Geometry,
  MultiPolygon,
} from "geojson";
import { Units } from "@turf/turf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchLocation } from "../utils/DirectionsHelper";
import { debounce } from "lodash";

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

  useEffect(() => {
    loadDiscoveredAreas();
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

          discoverArea(coordinates, 0.1);

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

  const worldBounds: [number, number, number, number] = [-180, -90, 180, 90];
  const fullMaskPolygon = turf.bboxPolygon(worldBounds);

  // Initial empty discovery area
  const initialDiscovery = turf.polygon([]);

  const [discoveredPolygons, setDiscoveredPolygons] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(initialDiscovery);

  const discoverArea = (center: [number, number], radius: number) => {
    const newDiscovery = turf.circle(center, radius, { units: "kilometers" });
    console.log("\x1b[34m newDiscovery", newDiscovery);
    setDiscoveredPolygons((prevPolygons) => {
      console.log("\x1b[33m prevPolygons", prevPolygons);
      if (!prevPolygons || turf.coordAll(prevPolygons).length === 0) {
        console.log("No discovered area yet");
        return newDiscovery;
      }

      const combined = turf.union(
        turf.featureCollection([prevPolygons, newDiscovery])
      );
      return combined;
    });
  };

  const [fogMask, setFogMask] = useState<Feature<
    Polygon | MultiPolygon
  > | null>(null);

  useEffect(() => {
    if (discoveredPolygons) {
      setFogMask(
        turf.difference(
          turf.featureCollection([fullMaskPolygon, discoveredPolygons])
        )
      );
      saveDiscoveredAreas();
    } else setFogMask(fullMaskPolygon);
  }, [discoveredPolygons]);

  const saveDiscoveredAreas = useCallback(
    debounce(async () => {
      try {
        await AsyncStorage.setItem(
          "discoveredAreas",
          JSON.stringify(discoveredPolygons)
        );
      } catch (error) {
        console.error("Error saving discovered areas: ", error);
      }
    }, 300), // Adjust the debounce delay as needed
    [discoveredPolygons]
  );

  const loadDiscoveredAreas = async () => {
    try {
      const data = await AsyncStorage.getItem("discoveredAreas");
      if (data) {
        setDiscoveredPolygons(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading discovered areas: ", error);
    }
  };

  const clearDiscoveredAreas = () => {
    setDiscoveredPolygons(initialDiscovery);
  };

  return (
    <View className="size-full flex-1 bg-blue-600 justify-center items-center">
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/codekatabattle/cm55m9p3i003b01po2yh31h59/draft"
        compassEnabled={true}
      >
        <MapboxGL.Camera ref={cameraRef} zoomLevel={15} />
        {UserLocation && (
          <MapboxGL.LocationPuck
            puckBearing={"course"}
            pulsing={{ isEnabled: true, color: "blue", radius: "accuracy" }}
          />
        )}
        <MapboxGL.ShapeSource id="fogLayer" shape={fogMask || fullMaskPolygon}>
          <MapboxGL.FillLayer
            id="fogFill"
            style={{
              fillColor: "black", // Mask color (can be adjusted)
              fillOpacity: 1, // Adjust visibility of the fog
            }}
          />
        </MapboxGL.ShapeSource>

        {/*         <MapboxGL.ShapeSource
          id="discoverLayer"
          shape={discoveredPolygons || initialDiscovery}
        >
          <MapboxGL.FillLayer
            id="discoverFill"
            style={{
              fillColor: "red", // Mask color (can be adjusted)
              fillOpacity: 0.8, // Adjust visibility of the fog
            }}
          />
        </MapboxGL.ShapeSource> */}
      </MapboxGL.MapView>

      <View className="size-full relative items-center ">
        <Button title="Clear discovered areas" onPress={clearDiscoveredAreas} />
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
