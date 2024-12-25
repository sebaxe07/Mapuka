import "./global.css";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/Home";
import DetailsScreen from "./src/screens/Details";

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
