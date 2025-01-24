import { Button } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, ScrollView } from "react-native";

interface DetailsProps {}

const Achivements: React.FC<DetailsProps> = ({}) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-10 justify-around">
      {/* Header */}
      <Text className="text-textWhite justify-center text-4xl font-normal mb-5 ml-10">
        Achivements
      </Text>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
    </View>
  );
};

export default Achivements;
