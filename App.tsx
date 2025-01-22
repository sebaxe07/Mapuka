import "./global.css";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { supabase } from "./src/utils/supabase";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/Home";
import DetailsScreen from "./src/screens/Details";
import MapScreen from "./src/screens/Map";
import MapFog from "./src/screens/MapFog";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/contexts/store";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerStyle: { backgroundColor: "tomato" },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: "Mapuka",
      },
    },
    Details: DetailsScreen,
    Map: MapScreen,
    MapFog: MapFog,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
}
