// FILE: src/utils/DirectionsHelper.test.tsx

import { searchLocation, traceRouteToMarker } from "../DirectionsHelper";
import { Alert } from "react-native";
import { MAPBOX_ACCESS_TOKEN } from "@env";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({ features: [{ geometry: { coordinates: [10, 20] } }] }),
  } as Response)
);

jest.mock("@env", () => ({
  MAPBOX_ACCESS_TOKEN: "test_token",
}));

const mockSetMarkerLocation = jest.fn();
const mockSetRouteCoords = jest.fn();
const mockCameraRef = {
  current: {
    setCamera: jest.fn(),
    fitBounds: jest.fn(),
    flyTo: jest.fn(),
    moveTo: jest.fn(),
    zoomTo: jest.fn(),
  },
};

describe("searchLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing if text is empty", async () => {
    await searchLocation({
      text: "",
      setMarkerLocation: mockSetMarkerLocation,
      cameraRef: mockCameraRef,
      userLocation: [0, 0],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockSetMarkerLocation).not.toHaveBeenCalled();
  });

  it("fetches location and updates marker and camera", async () => {
    await searchLocation({
      text: "test",
      setMarkerLocation: mockSetMarkerLocation,
      cameraRef: mockCameraRef,
      userLocation: [0, 0],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
        "test"
      )}&proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    expect(mockSetMarkerLocation).toHaveBeenCalledWith([10, 20]);
    expect(mockCameraRef.current.setCamera).toHaveBeenCalledWith({
      centerCoordinate: [10, 20],
      zoomLevel: 14,
      animationDuration: 1000,
    });
  });

  it("shows alert if no results found", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ features: [] }),
      })
    );

    jest.spyOn(Alert, "alert");

    await searchLocation({
      text: "test",
      setMarkerLocation: mockSetMarkerLocation,
      cameraRef: mockCameraRef,
      userLocation: [0, 0],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "No results found",
      "Please try a different search term."
    );
  });

  it("shows alert on fetch error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("API is down")
    );

    jest.spyOn(Alert, "alert");

    await searchLocation({
      text: "test",
      setMarkerLocation: mockSetMarkerLocation,
      cameraRef: mockCameraRef,
      userLocation: [0, 0],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Failed to fetch location. Please try again."
    );
  });

  it("shows alert if user location is not found", async () => {
    jest.spyOn(Alert, "alert");

    await traceRouteToMarker({
      userLocation: null,
      destination: [10, 20],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "User location not found",
      "Cannot trace a route."
    );
  });

  it("fetches route and updates route coordinates", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            routes: [
              {
                geometry: {
                  coordinates: [
                    [10, 20],
                    [30, 40],
                  ],
                },
              },
            ],
          }),
      })
    );

    await traceRouteToMarker({
      userLocation: [0, 0],
      destination: [10, 20],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.mapbox.com/directions/v5/mapbox/walking/0,0;10,20?alternatives=false&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    expect(mockSetRouteCoords).toHaveBeenCalledWith([
      [10, 20],
      [30, 40],
    ]);
  });

  it("shows alert if no route found", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ routes: [] }),
      })
    );

    jest.spyOn(Alert, "alert");

    await traceRouteToMarker({
      userLocation: [0, 0],
      destination: [10, 20],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "No route found",
      "Could not trace a route."
    );
  });

  it("shows alert on fetch error", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("API is down")
    );

    jest.spyOn(Alert, "alert");

    await traceRouteToMarker({
      userLocation: [0, 0],
      destination: [10, 20],
      setRouteCoords: mockSetRouteCoords,
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Failed to trace route. Please try again."
    );
  });
});
