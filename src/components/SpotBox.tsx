import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Place from "../../assets/icons/bookmarks/place.svg";
import Trash from "../../assets/icons/bookmarks/trash.svg";
import SpotDefault from "../../assets/images/bookmarks/spotDefault.svg";
import { colors } from "../../colors";
import { useNavigation } from "@react-navigation/native";
import { Spot } from "../contexts/slices/userDataSlice";

const SpotBox: React.FC<{
  spot_id: string;
  title: string;
  date: string;
  address: string;
  onPress: () => void;
  image?: string;
}> = ({
  spot_id,
  title,
  date: created_at,
  address: coordinates,
  onPress,
  image,
}) => {
  const navigation = useNavigation();

  const externalCoordinates = (latitude: number, longitude: number) => {};

  const [spotsData, setSpotsData] = useState<Spot[]>([
    {
      spot_id: "1",
      created_at: "14-04-2024",
      coordinates: [37.7749, -122.4194],
      address: "San Francisco, CA",
      title: "Golden Gate Park",
    },
    {
      spot_id: "2",
      created_at: "09-06-2023",
      coordinates: [40.7831, -73.9712],
      address: "Skyline Boulevard, NY",
      title: "Rooftop Cafe",
    },
    {
      spot_id: "3",
      created_at: "27-09-2024",
      coordinates: [46.7296, -94.6859],
      address: "Lakeview Crescent, MN",
      title: "Crystal Lake Dock",
    },
    {
      spot_id: "4",
      created_at: "19-03-2025",
      coordinates: [30.2672, -97.7431],
      address: "Downtown Square, TX",
      title: "Vintage Market Plaza",
    },
    {
      spot_id: "5",
      created_at: "31-08-2024",
      coordinates: [44.0521, -121.3153],
      address: "Cascade Hills, OR",
      title: "Secluded Waterfall",
    },
    {
      spot_id: "6",
      created_at: "02-05-2023",
      coordinates: [25.7617, -80.1918],
      address: "Creative District, FL",
      title: "Urban Art Alley",
    },
  ]);

  const handleDelete = (spotId: string) => {
    Alert.alert("Delete Spot", "Are you sure you want to delete this Spot?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setSpotsData((prev) =>
            prev.filter((spot) => spot.spot_id !== spotId)
          );
        },
      },
    ]);
  };

  return (
    <View
      className="flex-row items-center rounded-3xl p-4 px-2 mb-4 bg-boxContainer"
      style={{ minHeight: 130 }} // Adjust height here
    >
      {/* Left Section: SVG or Image */}
      <View className="mr-6 h-full">
        <SpotDefault
        /*  width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet" */
        />
      </View>

      {/* Right Section: Content */}
      <View className="flex-1 justify-around w-full">
        <View>
          <View className="flex-row justify-between items-center mb-2 pr-6">
            <Text className="text-textBody font-senRegular text-sm mb-1">
              {created_at}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(spot_id)}>
              <Trash />
            </TouchableOpacity>
          </View>
          <Text className="text-textWhite font-senMedium text-xl font-bold mb-2">
            {title}
          </Text>
          <View className="flex-row items-center mb-4">
            <Place
              width={16} // Slightly larger icon
              height={16}
              color={colors.bodyText}
              style={{ marginRight: 8 }} // Add space between icon and text
            />
            <Text className="text-textBody font-senRegular text-sm">
              {coordinates}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between w-full">
          <TouchableOpacity
            className="bg-buttonAccentRed rounded-3xl items-center justify-center w-2/3 px-5 py-3"
            onPress={onPress}
          >
            <Text className="text-white text-sm font-senBold">View Spot</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SpotBox;
