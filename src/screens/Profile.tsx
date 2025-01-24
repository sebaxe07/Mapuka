import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Icons from "../../assets/icons/profile/index";
import { signOut } from "../utils/UserManagement";
import { useAppDispatch, useAppSelector } from "../contexts/hooks";
import { clearUserData } from "../contexts/slices/userDataSlice";
import { useNavigation } from "@react-navigation/native";

const Profile: React.FC = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("User logged out") },
    ]);
  };

  const dispatch = useAppDispatch();
  const navigator = useNavigation();
  const logOut = async () => {
    console.log("User logged out");
    signOut();
    dispatch(clearUserData());
    navigator.navigate("Login");
  };

  const daysExplored = 25; // Example value
  const distanceExplored = 100; // Example value in km
  const achievementsCount = 30; // Example value

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 pt-10 justify-around">
      {/* Main Content */}
      <View className="flex-row h-2/5">
        {/* User Info Card */}
        <View className="flex-[0.8] bg-boxContainer rounded-3xl p-3 mr-3">
          <View className="flex-1 items-center justify-center">
            <Icons.UserIcon color="var(--color-text-white)" />
            <View className="mt-3 items-center">
              <Text className="text-textWhite text-3xl font-bold flex-wrap">
                Hello, Sebastian!
              </Text>
              <Text className="text-textBody text-sm">sebaxe09@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-1 flex-col justify-between">
          {/* Calendar Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md">
            <View className="justify-center">
              <Icons.Calendar color="var(--color-button-aqua)" width={40} />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2">
              <Text className="text-buttonAqua text-lg font-bold">
                {daysExplored} days
              </Text>
              <Text className="text-textBody text-sm">Of Exploring</Text>
            </View>
          </View>

          {/* Track Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md mt-0.5">
            <View className="justify-center">
              <Icons.Track color="var(--color-button-blue)" width={40} />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2">
              <Text className="text-buttonBlue text-lg font-bold">
                {distanceExplored} km
              </Text>
              <Text className="text-textBody text-sm">Explored</Text>
            </View>
          </View>

          {/* Achievements Section */}
          <View className="bg-boxContainer flex-[0.3] flex-row items-center justify-center rounded-3xl px-3 py-2 shadow-md mt-0.5">
            <View className="justify-center">
              <Icons.Achivements
                color="var(--color-button-purple)"
                width={40}
              />
            </View>
            <View className="flex-col items-start content-center justify-center ml-2">
              <Text className="text-buttonPurple text-lg font-bold">
                {achievementsCount}
              </Text>
              <Text className="text-textBody text-sm">Achievements</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Options Section */}
      <View className="space-y-4 mb-10">
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.User color="var(--color-text-white)" />
          <Text className="text-textWhite text-base ml-4">Your info</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.Lock color="var(--color-text-white)" />
          <Text className="text-textWhite text-base ml-4">Password</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-3 border-b border-textBody">
          <Icons.Settings color="var(--color-text-white)" />
          <Text className="text-textWhite text-base ml-4">Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="flex-row items-center py-3 rounded-lg justify-center"
        onPress={logOut}
      >
        <Icons.LogOut color="var(--color-text-white)" />
        <Text className="text-textWhite text-base ml-2">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
