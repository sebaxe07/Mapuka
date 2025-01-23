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
import Achivements from "./src/screens/Achivements";
import BookmarksScreen from "./src/screens/Bookmarks";
import Leaderboard from "./src/screens/Leaderboard";
import Profile from "./src/screens/Profile";
import { BackArrow } from "./assets/icons/profile";
import MapFog from "./src/screens/MapFog";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/contexts/store";
import { themes } from "./themes";
import { colors } from "./colors";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerShown: false,
    statusBarHidden: true,
    statusBarTranslucent: true,
    navigationBarHidden: true,
  },
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
    Map: MapScreen,
    Achivements: Achivements,
    Bookmarks: {
      options: ({ navigation }) => ({
        headerShown: true,
        headerTitle: "",
        headerTransparent: true,
        headerLeft: () => (
          <BackArrow
            color="--color-text-white"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
      screen: BookmarksScreen,
    },
    Leaderboard: Leaderboard,
    Profile: {
      options: ({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        headerTitleAlign: "center",
        headerTitle: "Profile",
        headerLargeTitle: true,
        headerTitleStyle: {
          color: "#ffffff",
        },
        headerLargeTitleStyle: {
          color: "#ffffff",
        },
        headerLeft: () => (
          <BackArrow color="#ffffff" onPress={() => navigation.goBack()} />
        ),
      }),
      screen: Profile,
    },
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
  const { colorScheme } = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View
          style={themes[colorScheme as unknown as keyof typeof themes]}
          className="size-full"
        >
          <Navigation />
        </View>
      </PersistGate>
    </Provider>
  );
}
