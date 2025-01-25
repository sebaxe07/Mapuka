import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

interface DetailsProps {}

const Leaderboard: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-10 justify-around"></View>
  );
};

export default Leaderboard;
