import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Icons from "../../assets/icons/profile/index";

const Profile: React.FC = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("User logged out") },
    ]);
  };

  return (
    <View className="flex-1 bg-bgMain px-5 py-5 mt-10 justify-around">
      {/* Main Content */}
      <View className="flex-row h-1/2">
        {/* User Info Card */}
        <View className="flex-1 bg-boxContainer rounded-xl p-4 mr-3">
          <View className="flex-1 items-center justify-center">
            <Icons.UserIcon color="var(--color-text-white)" />
            <View className="mt-4 items-center">
              <Text className="text-textWhite text-4xl font-bold">
                Hello, Sebastian!
              </Text>
              <Text className="text-textBody text-xl">sebaxe09@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-[1.2] flex-col justify-between">
          <View className="bg-boxContainer flex-1 flex-row items-center justify-center rounded-xl px-4 py-3 mb-3">
            <Icons.Calendar color="var(--color-button-aqua)" width={32} />
            <View className="flex-1 ml-4">
              <Text className="text-buttonAqua text-lg font-bold">25 days</Text>
              <Text className="text-textBody text-xs">Of Exploring</Text>
            </View>
          </View>
          <View className="bg-boxContainer flex-1 flex-row items-center justify-center rounded-xl px-4 py-3 mb-3">
            <Icons.Track color="var(--color-button-blue)" width={32} />
            <View className="flex-1 ml-4">
              <Text className="text-buttonBlue text-lg font-bold">100 km</Text>
              <Text className="text-textBody text-xs">Explored</Text>
            </View>
          </View>
          <View className="bg-boxContainer flex-1 flex-row items-center justify-center rounded-xl px-4 py-3">
            <Icons.Achivements color="var(--color-button-purple)" width={32} />
            <View className="flex-1 ml-4">
              <Text className="text-buttonPurple text-lg font-bold">30</Text>
              <Text className="text-textBody text-xs">Achievements</Text>
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
        onPress={handleLogout}
      >
        <Icons.LogOut color="var(--color-text-white)" />
        <Text className="text-textWhite text-base ml-2">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
