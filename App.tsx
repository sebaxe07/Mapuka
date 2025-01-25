import "react-native-reanimated";
import "react-native-gesture-handler";
import "./global.css";
import {
  createStaticNavigation,
  StaticParamList,
  useNavigation,
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
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoginScreen from "./src/screens/Login";
import { useEffect, useState } from "react";
import SplashScreen from "./src/components/SplashScreen";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "./src/contexts/hooks";
import { setAuth, setSession } from "./src/contexts/slices/userDataSlice";

function useIsSignedIn() {
  const isSignedIn = useAppSelector((state) => state.userData.auth);
  return isSignedIn === true;
}

function useIsSignedOut() {
  const isSignedIn = useAppSelector((state) => state.userData.auth);
  return isSignedIn === false || isSignedIn === null;
}

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    statusBarTranslucent: true,
    statusBarBackgroundColor: "transparent",
    navigationBarColor: "transparent",
    navigationBarTranslucent: true,
    animation: "slide_from_right",
  },
  screens: {
    // Common screens
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: HomeScreen,
        Details: DetailsScreen,
        Map: MapScreen,
        Achivements: {
          options: ({ navigation }) => ({
            animation: "slide_from_left",
          }),
          screen: Achivements,
        },
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
        Leaderboard: {
          options: ({ navigation }) => ({
            animation: "slide_from_left",
          }),
          screen: Leaderboard,
        },
        Profile: {
          options: ({ navigation }) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "Profile",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: "#ffffff",
            },
            headerLargeTitleStyle: {
              color: "#ffffff",
            },
            headerStyle: {
              backgroundColor: colors.background,
              shadowColor: "transparent",
            },
            headerLeft: () => (
              <BackArrow color="#ffffff" onPress={() => navigation.goBack()} />
            ),
          }),
          screen: Profile,
        },
        MapFog: MapFog,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        Login: {
          options: {
            headerShown: false,
            statusBarTranslucent: true,
            statusBarBackgroundColor: "transparent",
            navigationBarColor: "transparent",
            navigationBarTranslucent: true,
          },
          screen: LoginScreen,
        },
      },
    },
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
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
export function RootNavigator() {
  const { colorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [loaded, error] = useFonts({
    SenBold: require("./assets/fonts/Sen-Bold.ttf"),
    SenRegular: require("./assets/fonts/Sen-Regular.ttf"),
    SenExtraBold: require("./assets/fonts/Sen-ExtraBold.ttf"),
    SenMedium: require("./assets/fonts/Sen-Medium.ttf"),
    SenSemiBold: require("./assets/fonts/Sen-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const authState = useAppSelector((state) => state.userData.auth);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (data?.session) {
          console.log("\x1b[32m", "User is signed in");
          dispatch(setAuth(true));
          dispatch(setSession(data.session));
        } else {
          console.log("\x1b[31m", "User is signed out");
          dispatch(setAuth(false));
        }
      } catch (e) {
        console.error("Error restoring session:", e);
        dispatch(setAuth(false));
      }
      setLoading(false);
    };

    bootstrapAsync();
  }, [dispatch]);

  if (loading || !loaded) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView>
      <View
        style={themes[colorScheme as unknown as keyof typeof themes]}
        className="size-full"
      >
        <Navigation />
      </View>
    </GestureHandlerRootView>
  );
}
