import React, { Component, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text, Image } from "react-native";
import MapboxGL, { UserLocation } from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@env";

interface SearchLocationProps {
  text: string;
  setMarkerLocation: (location: [number, number]) => void;
  cameraRef: React.RefObject<MapboxGL.Camera>;
  userLocation: [number, number] | null;
  setRouteCoords: (route: [number, number][]) => void;
}

export const searchLocation = async ({
  text,
  setMarkerLocation,
  cameraRef,
  userLocation,
  setRouteCoords,
}: SearchLocationProps): Promise<void> => {
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
      traceRouteToMarker({
        userLocation,
        destination: [longitude, latitude],
        setRouteCoords,
      });
    } else {
      Alert.alert("No results found", "Please try a different search term.");
    }
  } catch (error) {
    //console.error("Error searching location: ", error);
    Alert.alert("Error", "Failed to fetch location. Please try again.");
  }
};

interface TraceRouteToMarkerProps {
  userLocation: [number, number] | null;
  destination: [number, number];
  setRouteCoords: (route: [number, number][]) => void;
}

export const traceRouteToMarker = async ({
  userLocation,
  destination,
  setRouteCoords,
}: TraceRouteToMarkerProps): Promise<void> => {
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
    //console.error("Error tracing route: ", error);
    Alert.alert("Error", "Failed to trace route. Please try again.");
  }
};
