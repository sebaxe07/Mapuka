import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

interface DetailsProps {}

const Leaderboard: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>

      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
};

export default Leaderboard;
