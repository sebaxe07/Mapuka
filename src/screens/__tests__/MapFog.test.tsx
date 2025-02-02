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

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

jest.mock("expo-location", () => ({
  ...jest.requireActual("expo-location"),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
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
  /* 
  it("renders essential UI", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
      }
    );

    const { debug, getByTestId } = renderWithProviders(
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

    debug();
    await waitFor(() => {
      expect(getByTestId("map-view")).toBeTruthy();
    });
  });

  it("handles spot coordinates", async () => {
    const setSpotCoordinates = jest.fn();
    const { rerender } = render(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={[10, 20]}
        setSpotCoordinates={setSpotCoordinates}
        onCoordinatesChange={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(setSpotCoordinates).toHaveBeenCalledWith(null);
    });

    rerender(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={setSpotCoordinates}
        onCoordinatesChange={jest.fn()}
      />
    );
  });

  it("handles user location updates", async () => {
    const onCoordinatesChange = jest.fn();
    const { rerender } = render(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={onCoordinatesChange}
      />
    );

    await act(async () => {
      Location.watchPositionAsync.mock.calls[0][1]({
        coords: { latitude: 10, longitude: 20 },
      });
    });

    await waitFor(() => {
      expect(onCoordinatesChange).toHaveBeenCalledWith([20, 10]);
    });

    rerender(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={onCoordinatesChange}
      />
    );
  });

  it("handles search text updates", async () => {
    const { rerender } = render(
      <Map
        searchText="test"
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />
    );

    rerender(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(MapboxGL.PointAnnotation).not.toBeNull();
    });
  });

  it("handles GPS and north actions", async () => {
    const setTriggerAction = jest.fn();
    const { rerender } = render(
      <Map
        searchText=""
        triggerAction="gps"
        setTriggerAction={setTriggerAction}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(setTriggerAction).toHaveBeenCalledWith("");
    });

    rerender(
      <Map
        searchText=""
        triggerAction="north"
        setTriggerAction={setTriggerAction}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(setTriggerAction).toHaveBeenCalledWith("");
    });
  });

  it("handles touch move", async () => {
    const { getByTestId } = render(
      <Map
        searchText=""
        triggerAction=""
        setTriggerAction={jest.fn()}
        onBearingChange={jest.fn()}
        mapType="custom"
        SpotCoordinates={null}
        setSpotCoordinates={jest.fn()}
        onCoordinatesChange={jest.fn()}
      />
    );

    fireEvent(getByTestId("map-view"), "onTouchMove");

    await waitFor(() => {
      expect(MapboxGL.Camera).not.toBeNull();
    }); 
  });*/
});
