import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import * as Location from "expo-location";
import HeadingIndicator from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@env";
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
import { searchLocation } from "../utils/DirectionsHelper";
import { debounce } from "lodash";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { setDiscoveredPolygon as setDiscStorage } from "../contexts/slices/userDataSlice";
import { supabase } from "../utils/supabase";
import { colors } from "../../colors";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// define 3 types of map, custom, dark, light as a type
type MapType = "custom" | "dark" | "light";

interface MapProps {
  searchText: string;
  triggerAction: string;
  setTriggerAction: (action: string) => void;
  onBearingChange: (bearing: number) => void;
  mapType: MapType;
  SpotCoordinates: [number, number] | null;
  setSpotCoordinates: (coordinates: [number, number] | null) => void;
  onCoordinatesChange: (coordinates: [number, number]) => void;
  
}

const debouncedSaveDiscoveredAreas = debounce(
  async (discoveredPolygons, profileId, dispatch) => {
    try {
      // console.log("\x1b[34m Saving discovered areas: ", discoveredPolygons);
      const discoveredPolygonsJson = JSON.stringify(discoveredPolygons);
      const areadiscovered = turf.convertArea(
        turf.area(discoveredPolygons),
        "meters",
        "kilometers"
      );
      // console.log("\x1b[31m", "saving on user " + profileId);
      const { data, error } = await supabase
        .from("profiles")
        .update({
          discovered_polygon: discoveredPolygonsJson,
          discovered_area: areadiscovered,
        })
        .eq("profile_id", profileId);

      if (error) {
        // console.error("Error saving discovered areas: ", error.message);
        return;
      }

      dispatch(setDiscStorage(discoveredPolygons));
      // console.log("\x1b[33m Saved discovered areas: ", data);
    } catch (error) {
      // console.error("Error saving discovered areas: ", error);
    }
  },
  1000
);
const Map: React.FC<MapProps> = ({
  searchText,
  triggerAction,
  setTriggerAction,
  onBearingChange,
  mapType,
  SpotCoordinates,
  setSpotCoordinates,
  onCoordinatesChange,
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const cameraRef = useRef<MapboxGL.Camera>(null);

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);
  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    null
  );
  const mapTypes = {
    custom: "mapbox://styles/codekatabattle/cm55m9p3i003b01po2yh31h59/draft",
    dark: "mapbox://styles/mapbox/dark-v11",
    light: "mapbox://styles/mapbox/light-v11",
  };

  const fogTypes = {
    custom: "#08081B",
    dark: "#1D1D1D",
    light: "#AEAEAE",
  };

  useEffect(() => {
    console.log(
      "\x1b[31m",
      "SpotCoordinates location received: ",
      SpotCoordinates
    );
    if (SpotCoordinates) {
      console.log("\x1b[32m", "Spot coordinates received: ", SpotCoordinates);
      setMarkerLocation(SpotCoordinates);
      // Clear the spot coordinates

      // Disabling auto-focus on user location
      setFocused(false);

      // Focus the camera on the spot location
      console.log("\x1b[33m", "Focusing camera on spot location...");

      setSpotCoordinates(null);
    }
  }, [SpotCoordinates]);

  const [fogColor, setFogColor] = useState(fogTypes[mapType]);
  const [mapStyle, setMapStyle] = useState(mapTypes[mapType]);
  useEffect(() => {
    setMapStyle(mapTypes[mapType]);
  }, [mapType]);

  useEffect(() => {
    requestUserLocation();
  }, []);

  const [focused, setFocused] = useState(true);

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
      // console.log("\x1b[32m", "Starting to watch position...");

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500,
          distanceInterval: 1,
        },
        (location) => {
          // console.log("\x1b[33m", "Location received: ", location);
          const { latitude, longitude } = location.coords;
          const coordinates: [number, number] = [longitude, latitude];
          setUserLocation(coordinates);
          onCoordinatesChange(coordinates);
          // console.log("User location: ", coordinates);
          // Before focusing the camera on the user's location, check if the location change is significant

          if (
            userLocation &&
            turf.distance(turf.point(userLocation), turf.point(coordinates)) <
              0.01
          ) {
            // console.log("Location change is not significant");
            return;
          }
          // console.log("\x1b[31m", "Location change is significant");

          discoverArea(coordinates, 0.1);

          setFocused((prevFocused) => {
            if (prevFocused) {
              console.log(
                "\x1b[34m",
                "Focusing camera on user location... " + prevFocused
              );
              // Focus camera on the user's location
              if (cameraRef.current) {
                cameraRef.current.setCamera({
                  centerCoordinate: coordinates,
                  zoomLevel: 16,
                  animationDuration: 1000, // Smooth transition
                });
              }
            }
            return prevFocused;
          });
        }
      );
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  const worldBounds: [number, number, number, number] = [-180, -90, 180, 90];
  const fullMaskPolygon = turf.bboxPolygon(worldBounds);

  // Initial empty discovery area
  const initialDiscovery = userData.discovered_polygon ?? turf.polygon([]);

  const [discoveredPolygons, setDiscoveredPolygons] = useState<Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  > | null>(initialDiscovery);

  const updateDiscoveredPolygons = debounce((newPolygon) => {
    setDiscoveredPolygons((prevPolygons) => {
      if (!prevPolygons || turf.coordAll(prevPolygons).length === 0) {
        return newPolygon;
      }
      return turf.union(turf.featureCollection([prevPolygons, newPolygon]));
    });
  }, 1000); // Runs at most once every 300ms

  const discoverArea = (center: [number, number], radius: number) => {
    const newDiscovery = turf.circle(center, radius, { units: "kilometers" });
    updateDiscoveredPolygons(newDiscovery);
  };

  /*   const discoverArea = (center: [number, number], radius: number) => {
    const newDiscovery = turf.circle(center, radius, { units: "kilometers" });
    // console.log("\x1b[32m", "New discovery: ");
    requestIdleCallback(() => {
      setDiscoveredPolygons((prevPolygons) => {
        if (!prevPolygons || turf.coordAll(prevPolygons).length === 0) {
          // console.log("No discovered area yet");
          return newDiscovery;
        }
        // console.log("Combining discovered areas...");
        const combined = turf.union(
          turf.featureCollection([prevPolygons, newDiscovery])
        );
        // console.log("\x1b[34m", "Combined: ");
        return combined;
      });
    });
  }; */

  const [fogMask, setFogMask] = useState<Feature<
    Polygon | MultiPolygon
  > | null>(null);

  useEffect(() => {
    if (discoveredPolygons) {
      // console.log("\x1b[35m", "discoveredPolygons");
      setFogMask(
        turf.difference(
          turf.featureCollection([fullMaskPolygon, discoveredPolygons])
        )
      );
      // console.log("\x1b[36m", "Fog mask updated");
      saveDiscoveredAreas();
    } else setFogMask(fullMaskPolygon);
  }, [discoveredPolygons]);

  const saveDiscoveredAreas = useCallback(() => {
    // console.log("\x1b[32m", "Saving discovered areas...");
    debouncedSaveDiscoveredAreas(
      discoveredPolygons,
      userData.profile_id,
      dispatch
    );
  }, [discoveredPolygons, userData.profile_id, dispatch]);

  const clearDiscoveredAreas = async () => {
    setDiscoveredPolygons(initialDiscovery);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          discovered_polygon: null,
          discovered_area: 0,
        })
        .eq("profile_id", userData.profile_id);

      if (error) {
        // console.error("Error clearing discovered areas: ", error.message);
        return;
      }
      dispatch(setDiscStorage(null));
      // console.log("Cleared discovered areas: ", data);
    } catch (error) {
      // console.error("Error clearing discovered areas: ", error);
    }
  };

  const [text, setText] = useState("");
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);

  useEffect(() => {
    console.log(
      "\x1b[31m",
      "markerLocation location received: ",
      markerLocation
    );
    if (markerLocation && cameraRef.current) {
      console.log("\x1b[32m", "Setting camera: ", markerLocation);
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: markerLocation,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    }
  }, [markerLocation]);

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
    if (searchText) {
      // console.log("Setting text: ", searchText);
      setText(searchText);
    } else {
      // console.log("Clearing text");
      setText("");
    }
  }, [searchText]);

  useEffect(() => {
    if (text) {
      useSearch();
    } else {
      setMarkerLocation(null);
      setRouteCoords(null);
    }
  }, [text]);

  useEffect(() => {
    if (triggerAction === "gps") {
      console.log("\x1b[32m", "Triggering GPS action...");
      // Focus the map on the user's location
      if (cameraRef.current && userLocation) {
        setFocused(true);
        cameraRef.current.setCamera({
          centerCoordinate: userLocation,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    } else if (triggerAction === "north") {
      // Rotate the map to face north
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          heading: 0,
          animationDuration: 1000,
        });
      }
    }
    setTriggerAction("");
  }, [triggerAction]);
  const handleTouchMove = useMemo(
    () =>
      debounce(() => {
        // console.log("Touch move detected");
        if (focused) setFocused(false);
      }, 300),
    [focused]
  );

  useEffect(() => {
    console.log("\x1b[31m", "Focused: ", focused);
  }, [focused]);

  return (
    <View className="size-full flex-1  justify-center items-center">
      <MapboxGL.MapView
        style={styles.map}
        styleURL={mapStyle}
        compassEnabled={false}
        scaleBarEnabled={false}
        onCameraChanged={(e) => {
          onBearingChange(e.properties.heading);
        }}
        pitchEnabled={false}
        onTouchMove={handleTouchMove}
      >
        <MapboxGL.Images
          images={{
            locationIcon: require("../../assets/images/Navigation.png"),
          }}
        />
        <MapboxGL.Camera ref={cameraRef} zoomLevel={15} />
        {UserLocation && (
          <MapboxGL.LocationPuck
            puckBearing={"course"}
            topImage="locationIcon"
            scale={2}
            pulsing={{
              isEnabled: true,
              color: colors.purple,
              radius: "accuracy",
            }}
          />
        )}

        {!userLocation && (
          <View className="absolute items-center justify-center w-1/2 h-12 bg-boxMenu rounded-3xl z-10">
            <Text className="text-textInput font-senSemiBold text-lg">
              No location detected
            </Text>
          </View>
        )}
        <MapboxGL.ShapeSource id="fogLayer" shape={fogMask || fullMaskPolygon}>
          <MapboxGL.FillLayer
            id="fogFill"
            style={{
              fillColor: fogColor,
              fillOpacity: 0.95, // Adjust visibility of the fog
            }}
          />
        </MapboxGL.ShapeSource>

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
                lineColor: colors.aqua,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
        {markerLocation && (
          <MapboxGL.PointAnnotation
            id="marker"
            coordinate={markerLocation}
            style={{
              zIndex: 100,
            }}
          >
            <View className="size-4 bg-buttonAccentRed z-50 rounded-full" />
          </MapboxGL.PointAnnotation>
        )}

        {/* <MapboxGL.ShapeSource
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

      {/*       <View className="size-full relative items-center justify-end">
        <Button title="cl" onPress={clearDiscoveredAreas} />
      </View> */}
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
