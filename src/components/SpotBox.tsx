import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Place from "../../assets/icons/bookmarks/place.svg";
import Trash from "../../assets/icons/bookmarks/trash.svg";
import SpotDefault from "../../assets/images/bookmarks/spotDefault.svg";
import { colors } from "../../colors";
import { setSpots, Spot } from "../contexts/slices/userDataSlice";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { supabase } from "../utils/supabase";

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
  const externalCoordinates = (latitude: number, longitude: number) => {};
  const spotsData = useAppSelector((state) => state.userData.spots);
  const dispatch = useAppDispatch();

  const deleteSpot = async (spotId: string) => {
    const { data, error } = await supabase
      .from("spots")
      .delete()
      .eq("spot_id", spotId);

    if (error) {
      console.error("Error deleting spot: ", error.message);
      return;
    }
  };

  const handleDelete = (spotId: string) => {
    Alert.alert("Delete Spot", "Are you sure you want to delete this Spot?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Delete from database first
            await deleteSpot(spotId);

            if (!spotsData) {
              return;
            }

            // Update Redux state directly (global state)
            const filteredSpots = spotsData.filter((n) => n.spot_id !== spotId);
            dispatch(setSpots(filteredSpots));
          } catch (error) {
            console.error("Error deleting spot:", error);
          }
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
            <TouchableOpacity
              testID="delete-button"
              onPress={() => handleDelete(spot_id)}
            >
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
