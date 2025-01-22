import "./global.css";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/Home";
import DetailsScreen from "./src/screens/Details";
import MapScreen from "./src/screens/Map";
import Achivements from "./src/screens/Achivements";
import Bookmarks from "./src/screens/Bookmarks";
import Leaderboard from "./src/screens/Leaderboard";
import Profile from "./src/screens/Profile";
import { BackArrow } from "./assets/icons/profile";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerShown: false,
    statusBarHidden: true,
    navigationBarHidden: true,
  },
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
    Map: MapScreen,
    Achivements: Achivements,
    Bookmarks: Bookmarks,
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
  return <Navigation />;
}
