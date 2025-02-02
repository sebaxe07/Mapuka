import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Map from "../MapFog";
import { useAppDispatch, useAppSelector } from "../../contexts/hooks";
import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import { Provider } from "react-redux";
import userDataReducer from "../../contexts/slices/userDataSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

jest.mock("@rnmapbox/maps", () => ({
  __esModule: true,
  default: {
    setAccessToken: jest.fn(),
    MapView: jest.fn().mockReturnValue(null),
    Camera: jest.fn().mockReturnValue(null),
    UserLocation: jest.fn().mockReturnValue(null),
    LocationPuck: jest.fn().mockReturnValue(null),
    ShapeSource: jest.fn().mockReturnValue(null),
    FillLayer: jest.fn().mockReturnValue(null),
    LineLayer: jest.fn().mockReturnValue(null),
    PointAnnotation: jest.fn().mockReturnValue(null),
    Images: jest.fn().mockReturnValue(null),
  },
}));

/* jest.mock("expo-location", () => {
  const actualLocation = jest.requireActual("expo-location");
  return {
    ...actualLocation,
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
    watchPositionAsync: jest.fn().mockImplementation((options, callback) => {
      callback({ coords: { latitude: 0, longitude: 0 } });
      return Promise.resolve({
        remove: jest.fn(),
      });
    }),
  };
}); */
jest.mock("expo-location", () => ({
  ...jest.requireActual("expo-location"),
  requestForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

jest.mock("../../utils/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

const initialState = {
  userData: {
    session: null,
    auth: null,
    profile_id: "85c76b",
    email: "",
    name: "",
    lastname: "",
    discovered_area: 0,
    discovered_polygon: null,
    achievements: [],
    created_at: "",
    pic: null,
    notes: [],
    spots: [],
  },
};

const renderWithProviders = (
  ui:
    | string
    | number
    | boolean
    | React.JSX.Element
    | Iterable<React.ReactNode>
    | null
    | undefined,
  {
    preloadedState = initialState,
    store = configureStore({
      reducer: { userData: userDataReducer },
      preloadedState,
    }),
  } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("MapFog Screen", () => {
  const rootReducer = combineReducers({
    userData: userDataReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });

  it("renders essential UI", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const { getByTestId } = renderWithProviders(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    await waitFor(() => {
      expect(getByTestId("map-view")).toBeTruthy();
    });
  });

  it("handles spot coordinates", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const setSpotCoordinates = jest.fn();
    const { rerender } = renderWithProviders(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={[10, 20]}
        setSpotCoordinates={setSpotCoordinates}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    await waitFor(() => {
      expect(setSpotCoordinates).toHaveBeenCalledWith(null);
    });
  });

  it("requests location permission and starts tracking", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const locationUpdates = [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 37.775, longitude: -122.4195 },
      { latitude: 37.7751, longitude: -122.4196 },
    ];

    (Location.watchPositionAsync as jest.Mock).mockImplementation(
      async (_options, callback) => {
        locationUpdates.forEach((coords, index) => {
          setTimeout(() => {
            callback({ coords });
          }, index * 2000); // Simulate movement every 2 second
        });
        return { remove: jest.fn() }; // Mock remove function
      }
    );
    const { getByTestId } = renderWithProviders(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    await new Promise((resolve) => setTimeout(resolve, 6000));

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.watchPositionAsync).toHaveBeenCalled();
  }, 10000);

  it("handles search text updates", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const { rerender } = renderWithProviders(
      <Map
        searchText="test"
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );
  });

  it("handles GPS action", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const setTriggerAction = jest.fn();
    const { rerender } = renderWithProviders(
      <Map
        searchText=""
        triggerAction="gps"
        setTriggerAction={setTriggerAction}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    await waitFor(() => {
      expect(setTriggerAction).toHaveBeenCalledWith("");
    });
  });
  it("handles north action", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    // Mock cameraRef.current && userLocation
    const cameraRef = {
      current: {
        setCamera: jest.fn(),
      },
    };

    const userLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
    };
    jest.spyOn(React, "useRef").mockReturnValue(cameraRef);
    jest.spyOn(React, "useState").mockReturnValue([userLocation, jest.fn()]);
    const setTriggerAction = jest.fn();
    const { rerender } = renderWithProviders(
      <Map
        searchText=""
        triggerAction="gps"
        setTriggerAction={setTriggerAction}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    await waitFor(() => {
      /*       expect(cameraRef.current.setCamera).toHaveBeenCalledWith({
        heading: 0,
        animationDuration: 1000,
      }); */
      expect(setTriggerAction).toHaveBeenCalledWith("");
    });

    await waitFor(() => {
      expect(setTriggerAction).toHaveBeenCalledWith("");
    });
  });
  it("handles denied permission", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "denied",
      }
    );

    const setTriggerAction = jest.fn();
    const { rerender } = renderWithProviders(
      <Map
        searchText=""
        triggerAction="gps"
        setTriggerAction={setTriggerAction}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );
  });

  it("handles touch move", async () => {
    const { getByTestId } = renderWithProviders(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />,
      { store }
    );

    fireEvent(getByTestId("map-view"), "onTouchMove");
  });
});
