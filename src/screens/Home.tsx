import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("Details")}>
        Go to Details
      </Button>
    </View>
  );
};

export default Home;
