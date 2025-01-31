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
import AchivementsScreen from "./src/screens/Achivements";
import BookmarksScreen from "./src/screens/Bookmarks";
import NoteDetailsScreen from "./src/screens/NoteDetails";
import LeaderboardScreen from "./src/screens/Leaderboard";
import ProfileScreen from "./src/screens/Profile";
import SettingsScreen from "./src/screens/Settings";
import UserDataScreen from "./src/screens/UserData";
import ResetPasswordScreen from "./src/screens/ResetPassword";
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
import Toast from "react-native-toast-message";

import BackArrow from "./src/components/backArrow";

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
        Home: {
          /* initialParams: {
            externalCoordinates: { latitude: null, longitude: null },
          }, */
          screen: HomeScreen,
          animation: "slide_from_right",
        },
        Details: DetailsScreen,
        Map: MapScreen,
        Achivements: {
          options: ({}) => ({
            animation: "slide_from_left",
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: AchivementsScreen,
        },
        Bookmarks: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: BookmarksScreen,
        },
        NoteDetails: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          initialParams: { itemId: "0" },
          screen: NoteDetailsScreen,
        },
        Leaderboard: {
          options: ({}) => ({
            animation: "slide_from_left",
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: LeaderboardScreen,
        },
        Profile: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "Profile",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
              shadowColor: "transparent",
            },
            headerShadowVisible: false,
            headerBackVisible: false,
            headerLeft: () => <BackArrow />,
          }),
          screen: ProfileScreen,
        },
        UserData: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: UserDataScreen,
        },
        ResetPassword: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: ResetPasswordScreen,
        },
        Settings: {
          options: ({}) => ({
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: "",
            headerLargeTitle: true,
            headerTitleStyle: {
              color: colors.lightText,
            },
            headerLargeTitleStyle: {
              color: colors.lightText,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => <BackArrow />,
          }),
          screen: SettingsScreen,
        },
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
        <Toast />
      </View>
    </GestureHandlerRootView>
  );
}
